class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :correct_user?
  before_action :find_user

  def show
    @user_func = [@user, @user.function]
    # @article = Article.find(rand(Article.data.length))[:name]
    # こちらの機能は後ほど実装します。
  end

  def edit
  end

  def update
    if @user.id != params[:id].to_i
      return nil
    else
      user_params
      @user.nickname = user_params[:nickname]
      @user.email = user_params[:email]
      @user.function.mail_remind = user_params[:mail_remind].to_i
      @user.function.line_remind = user_params[:line_remind].to_i
      if @user.save && @user.function.save
        render json:{ post: [@user, @user.function] }
      else
        return nil
      end
    end
  end

  private
  def correct_user?
    find_user
    if @user.id != current_user.id 
      redirect_to root_path
    end
  end

  def find_user
    @user = User.find(params[:id])
  end

  def user_params
    params.permit(:nickname, :email, :mail_remind, :line_remind)
  end

end
