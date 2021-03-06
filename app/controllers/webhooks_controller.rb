class WebhooksController < ApplicationController
  protect_from_forgery except: [:callback] # CSRF対策無効化

  def client
    @client ||= Line::Bot::Client.new { |config|
      config.channel_secret = ENV["LINE_CHANNEL_SECRET"]
      config.channel_token = ENV["LINE_CHANNEL_TOKEN"]
    }
  end
  
  def callback
    body = request.body.read

    if params[:remind] == "on"
      user_lines = []
      user_emails = []
      functions = Function.where(line_remind: 1).or(Function.where(mail_remind: 1))
      functions.each do |function|
        if function.line_remind == 1
          lineaccount = Lineaccount.find_by(user_id: function.user_id)
          user_lines.push(lineaccount.uid)
        elsif function.email_remind == 1
          user = User.find(function.user_id)
          user_emails.push(user.email)
        end
      end
      if user_lines != []
        create_broadcast(user_lines)
      end
      if user_emails != []
        SampleMailer.sample_mailer.auto_broadcast(user_emails)
      end

    else
      signature = request.env['HTTP_X_LINE_SIGNATURE']
      unless client.validate_signature(body, signature)
        halt 400, {'Content-Type' => 'text/plain'}, 'Bad Request'
      end

      events = client.parse_events_from(body)

      events.each do |event|
        case event
        when Line::Bot::Event::Message
          case event.type
          when Line::Bot::Event::MessageType::Text

            case event.message["text"]
            when "日記"
              if line_user = Lineaccount.where(uid: event["source"]["userId"]).limit(1)
                if user = User.find(line_user[0].user.id)
                  diary = Diary.where(user_id: user.id).order(created_at: :desc).limit(2)
                  today = Date.today.to_s
                  if diary == []
                    if user.function.diary_mode == 0 || user.function.diary_mode == 1
                      if user.function.memo_mode == 1
                        user.function.memo_mode = 0
                        user.function.save
                      end
                      if user.function.diary_mode == 0
                        user.function.diary_mode = 1
                        user.function.save
                      end
                      2.times do |num|
                        Diary.create(user_id: user.id, question: num+1)
                      end
                      reply_question(event)
                    end
                  elsif diary[0].content == nil && diary[1].content == nil
                    2.times do |num|
                      diary[num].destroy
                      Diary.create(user_id: user.id, question: num+1)
                    end
                    if user.function.diary_mode == 0 || user.function.diary_mode == 1
                      if user.function.memo_mode == 1
                        user.function.memo_mode = 0
                        user.function.save
                      end
                      if user.function.diary_mode == 0
                        user.function.diary_mode = 1
                        user.function.save
                      end
                      reply_question(event)
                    # else
                    #   reply_question(event)
                    end
                  elsif diary[0].created_at.to_s.include?(today) == false
                    if diary[0].content || diary[1].content
                      2.times do |num|
                        Diary.create(user_id: user.id, question: num+1)
                      end
                      if user.function.diary_mode == 0 || user.function.diary_mode == 1
                        if user.function.memo_mode == 1
                          user.function.memo_mode = 0
                          user.function.save
                        end
                        if user.function.diary_mode == 0
                          user.function.diary_mode = 1
                          user.function.save
                        end
                        reply_question(event)
                      end
                    end
                  elsif (diary[0].content || diary[1].content) && diary[0].created_at.to_s.include?(today)
                    reply_url(event)
                  end
                  # content_1が埋まっているが日付が昨日の場合を作る。
                else
                  reply_not_registered(event)
                end
              else
                reply_not_registered(event)
              end

            when "メモ"
              if line_user = Lineaccount.where(uid: event["source"]["userId"]).limit(1)
                if user = User.find(line_user[0].user.id)
                  function = user.function
                  if function.diary_mode == 1 
                      function.diary_mode = 0
                      if function.memo_mode == 0
                        function.memo_mode = 1
                        function.save
                        reply_memo_mode(event)
                      elsif function.memo_mode == 1
                        function.save
                        reply_memo_mode(event)
                      end
                  elsif function.diary_mode == 0 && function.memo_mode == 1
                    reply_memo_mode(event)
                  elsif function.diary_mode == 0 && function.memo_mode == 0
                    function.memo_mode =1
                    function.save
                    reply_memo_mode(event)
                  end
                else
                  reply_not_registered(event)
                end
              else
                reply_not_registered(event)
              end
            
            # when ""
            #   users_info = Lineaccount.all.where()

            else
              if line_user = Lineaccount.where(uid: event["source"]["userId"]).limit(1)
                if user = User.find(line_user[0].user.id)
                  function = user.function
                  diary = Diary.where(user_id: user.id).order(created_at: :desc).limit(2)
                  if function.diary_mode == 1 && function.memo_mode == 0 && diary[1].content == nil && diary[0].content == nil
                    diary[1].content = event.message["text"]
                    diary[1].save
                    reply_Q1(event)
                  elsif function.diary_mode == 1 && function.memo_mode == 0 && diary[1].content && diary[0].content == nil
                    diary[0].content = event.message["text"]
                    diary[0].save
                    function.diary_mode = 0
                    function.save
                    reply_Q2(event)
                  elsif function.diary_mode == 0 && function.memo_mode == 1
                    Memo.create(content: event.message["text"], user_id: user.id)
                    reply_Q2(event)
                    function.memo_mode = 0
                    function.save
                  end
                else
                  reply_not_registered(event)
                end
              else
                reply_not_registered(event)
              end
            end

          end
        end
      end
      "OK"
    end
  end


  private
  def reply_not_registered(event)
    message = {
      type: 'text',
      text: "登録されたアカウントがありません。サイトから登録をお願いいたします。"
    }
    client.reply_message(event['replyToken'], message)
  end

  def reply_url(event)
    message = {
      type: 'text',
      text: "本日は投稿済みです。\n「Go to Kotodama」から確認できます。"
    }
    client.reply_message(event['replyToken'], message)
  end

  def reply_question(event)
    message = {
      type: 'text',
      text: "日記投稿\nQ1. 今日はどんなことがありましたか？"
    }
    client.reply_message(event['replyToken'], message)
  end

  def reply_Q1(event)
    message = {
      type: 'text',
      text: "Q1 を保存しました。\nQ2. 今どんなことを感じてますか？"
    }
    client.reply_message(event['replyToken'], message)
  end

  def reply_Q2(event)
    message = {
      type: 'text',
      text: "保存しました。\n「Go to Kotodama」から確認できます。"
    }
    client.reply_message(event['replyToken'], message)
  end

  def reply_memo_mode(event)
    message = {
      type: 'text',
      text: "メモ投稿\n自由に書いてみてください。"
    }
    client.reply_message(event['replyToken'], message)
  end

  def create_broadcast(user_lines)
    message = {
      type: 'text',
      text: "こんばんは。今日はどんなことがありましたか？どんなことを感じましたか？あなたの思いを言葉にしてみてください。"
    }
    client.multicast(user_lines, message)
  end

end
