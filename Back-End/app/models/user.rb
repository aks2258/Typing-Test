class User < ApplicationRecord
  has_many :tests

  validates :username, presence: true
  validates :username, uniqueness: true
  validates :password, presence: true
  
end
