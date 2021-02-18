class ApplicationMailer < ActionMailer::Base
  default from: 'selfdiary_master',
          bcc: 'forsomeone1018nn@gmail.com',
          reply_to: 'selfdiarymaster777@gmail.com'
  layout 'mailer'
end
