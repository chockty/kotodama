require 'test_helper'

class SampleMailerTest < ActionMailer::TestCase
  test "auto_send" do
    mail = SampleMailer.auto_send
    assert_equal "Auto send", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
