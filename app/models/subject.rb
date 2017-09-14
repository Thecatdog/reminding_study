class Subject < ActiveRecord::Base
    has_many :users, through: :studies
    has_many :studies
    has_many :contents
    has_many :fail_questions
    
    validates_length_of :sub_name, :minimum => 1, :maximum => 20

end
