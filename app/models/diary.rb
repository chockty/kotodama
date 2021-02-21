class Diary < ApplicationRecord
  validates :user_id, presence: true
  validates :question, presence: true
  belongs_to :user
end
