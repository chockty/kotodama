class Function < ApplicationRecord
  with_options presence: true do
    validates :line_remind, :mail_remind, :diary_mode, :memo_mode, :user_id
  end

  belongs_to :user
end
