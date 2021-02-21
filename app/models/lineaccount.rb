class Lineaccount < ApplicationRecord
  validates :uid, presence: true, uniqueness: { case_sensitive: true }
  belongs_to :user, optional: true
end
