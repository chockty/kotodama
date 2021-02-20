class ContentsController < ApplicationController
  before_action :authenticate_user!, except:[:top]

  def top
  end

  def index
    @diaries = Diary.where(user_id: current_user.id).includes(:user)
    @memos = Memo.where(user_id: current_user.id).includes(:user)
    if params[:fetch] == "ON"
      render json:{diaries: @diaries, memos: @memos}
    else
      @article = Article.find(rand(Article.data.length))[:name]
      @a_week = days()
      @user = User.find(current_user.id)
    end
  end

  def search
    keyword = params[:keyword][0]
    datestart = params[:datestart][0]
    dateend = params[:dateend][0]
    result = []

    if keyword != nil && datestart != nil && dateend != nil
      diaries = Diary.where(user_id: current_user.id).where("content LIKE(?)", "%#{keyword}%").where("created_at BETWEEN (?) AND (?)", "#{datestart}%", "#{dateend}%").includes(:user)
      memos = Memo.where(user: current_user.id).where("content LIKE(?)", "%#{keyword}%").where("created_at BETWEEN (?) AND (?)", "#{datestart}%", "#{dateend}%").includes(:user)
      result.push(diaries, memos)
    elsif keyword != nil
      diaries = Diary.where(user_id: current_user.id).where("content LIKE(?)", "%#{keyword}%").includes(:user).order("created_at DESC")
      memos = Memo.where(user: current_user.id).where("content LIKE(?)", "%#{keyword}%").includes(:user).order("created_at DESC")
      if diaries == [] && memos == []
        render json:{result: "検索結果は０件でした"}
      end
      result.push(diaries, memos)
    elsif datestart != nil && dateend != nil
      diaries = Diary.where(user_id: current_user.id).where("created_at BETWEEN (?) AND (?)", "#{datestart}%", "#{dateend}%").includes(:user)
      memos = Memo.where(user: current_user.id).where("created_at BETWEEN (?) AND (?)", "#{datestart}%", "#{dateend}%").includes(:user)
      result.push(diaries, memos)
    end
    render json:{result: result}
  end

  private
  def days 
    wdays = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.']
    a_week = []
    today = Date.today
    3.times do |num|
      a_day = today.next_day(num-3)
      create_a_week(a_week, a_day, wdays)
    end

    a_day = {day: today, wday: wdays[today.wday]}
    a_week.push(a_day)

    3.times do |num|
      a_day = today.next_day(num+1)
      create_a_week(a_week, a_day, wdays)
    end

    return a_week
  end

  def create_a_week(a_week, a_day, wdays)
    wday_num = a_day.wday
    a_day = {day: a_day, wday: wdays[wday_num]}
    a_week.push(a_day)
  end

end
