class SampleMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.sample_mailer.auto_send.subject
  #
  def auto_send(user)
    @user = user
    mail to:      user.email,
         subject: '登録ありがとうございます！'
  end
end
