class Memo < ApplicationRecord
  validates :content, presence: true
  validates :user_id, presence: true
  belongs_to :user
end
