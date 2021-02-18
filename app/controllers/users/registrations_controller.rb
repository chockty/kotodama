# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # POST /resource
  def create
    if params[:sns_auth]
      sns = Lineaccount.find(params[:sns_auth])
      if @user = User.find_by(email: params[:user][:email])
        sns.user = @user
        sns.save
        sign_in_and_redirect @user, event: :authentication
      else
        pass = Devise.friendly_token
        params[:user][:password] = pass
        params[:user][:password_confirmation] = pass
        if super
          @user = User.find_by(email: params[:user][:email])
          Function.create(user_id: @user.id)
          sns.user = @user
          sns.save
          AutoMaierMailer.send_when_create(@user).deliver
        end
      end
    elsif !params[:sns_auth]
      super
      @user = User.find_by(email: params[:user][:email])
      Function.create(user_id: @user.id)
      AutoMaierMailer.send_when_create(@user).deliver
    end
  end

end
