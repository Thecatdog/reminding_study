class Content < ActiveRecord::Base
    belongs_to :subject
    validates_length_of :title, :minimum => 1, :maximum => 40
    validates_length_of :all_content, :minimum => 1
    serialize :long_content_q, Array
    serialize :long_content_a, Array
    serialize :short_content, Array
end
