class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  before_action :configure_permitted_parameters, if: :devise_controller?
  #devise関連のコントローラが呼ばれた時、before_actionを使用する。
  private
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
    #ストロングパラメータの一種。不要なデータを取り扱いできないように設定する。
  end

  def after_sign_in_path_for(resource) 
    user_contents_path(resource.id)
  end
end
