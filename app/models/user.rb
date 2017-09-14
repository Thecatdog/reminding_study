class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  after_create :assign_default_role

  def assign_default_role
    self.add_role(:user) if self.roles.blank?
  end
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  include Authority::UserAbilities
  has_many :subjects, through: :studies
  has_many :studies
  has_many :fail_questions
  has_many :meetings
  
  validates_length_of :school, :minimum => 3, :maximum => 15
  validates_length_of :major, :minimum => 1
  validates_length_of :name, :minimum => 1

end
