class CreateSubjects < ActiveRecord::Migration
  def change
    create_table :subjects do |t|
      t.string :sub_name
      t.date :dday
      t.timestamps null: false
    end
  end
end
