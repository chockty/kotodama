class MemosController < ApplicationController
  before_action :authenticate_user!
  before_action :correct_user?, except:[:search, :create]
  before_action :find_memo, except:[:search, :create]

  def show
    @article = Article.find(rand(Article.data.length))[:name]
  end

  def create
    if current_user.id != params[:user]
      redirect_to root_path
    end
    @memo = Memo.new(user_id: create_params[:user], content: create_params[:content])
    if @memo.save == false
      render json:{result: "Error Occured"}
    else
      render json:{result: "Success"}  
    end
  end

  def update
    if @memo.id != params[:id].to_i
      redirect_to root_path
    end
    new_content = memo_params
    @memo.content = new_content[:content]
    if @memo.save
       render json:{ post: @memo }
    else
      return nil
    end
  end

  private
  def correct_user?
    find_memo
    if @memo.user_id != current_user.id 
      redirect_to root_path
    end
  end

  def find_memo
    @memo = Memo.find(params[:id])
  end

  def create_params
    params.permit(:user, :content)
  end

  def memo_params
    params.require(:memo).permit(:content)
  end
end
