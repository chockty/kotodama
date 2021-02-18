# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def line
    authorization
  end

  private
  def authorization
    user_info = User.from_omniauth(request.env["omniauth.auth"])
    @sns = user_info[:sns]
    @user = user_info[:user]
    # LINEアカウントの情報がDBにある場合はindexのページへ遷移する。
    if Lineaccount.find_by(uid: @sns.uid)
      @sns = Lineaccount.find_by(uid: @sns.uid)
      if @user = User.find(@sns.user_id)
        sign_in_and_redirect @user, event: :authentication
      else
        render template: 'devise/registrations/new'
      end
    # LINEアカウントの情報がDBにない場合は、snsを保存した上で、user情報を持って新規登録のページへ遷移する。
    elsif !Lineaccount.find_by(uid: @sns.uid)
      @sns.save
      @sns_auth = Lineaccount.find_by(uid: @sns.uid)
      render template: 'devise/registrations/new'
    end
  end
end
