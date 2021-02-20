class DiariesController < ApplicationController
  before_action :authenticate_user!
  before_action :correct_user?, except:[:search, :create]
  before_action :find_diary, except:[:search, :create]

  def show
    @article = Article.find(rand(Article.data.length))[:name]
  end

  def create
    2.times do |n|
      @diary = Diary.new(user_id: create_params[:user], content: create_params[:content][n], quetion: n+1)
      if @diary.save == false
        render json:{ result: "Error Occured"}
      end
    end
    render json:{ result: "Success" }
  end

  def update
    if @diary.id != params[:id].to_i
      redirect_to root_path
    end
    new_content = diary_params
    @diary.content = new_content[:content]
    if @diary.save
      render json:{ post: @diary }
    else
      return nil
    end
  end

  def search
    if search_params[:user] != current_user.id
      redirect_to root_path
    end
    @result = Diary.where(user_id: search_params[:user]).where('created_at LIKE(?)', "#{search_params[:day]}%")
    render json:{ result: @result}
  end

  private
  def correct_user?
    find_diary
    if @diary.user_id != current_user.id 
      redirect_to new_user_session_path
    end
  end

  def find_diary
    @diary = Diary.find(params[:id])
  end

  def diary_params
    params.require(:diary).permit(:content)
  end

  def create_params
    params.permit(:user).merge(content: params[:diary][:content])
  end

  def search_params
    params.permit(:id, :day, :user)
  end
end
