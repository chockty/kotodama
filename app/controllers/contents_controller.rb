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
