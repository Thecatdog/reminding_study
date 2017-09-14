class Study < ActiveRecord::Base
    belongs_to :user
    belongs_to :subject

end
