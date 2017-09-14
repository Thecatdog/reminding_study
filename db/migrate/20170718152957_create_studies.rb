class CreateStudies < ActiveRecord::Migration
  def change
    create_table :studies do |t|
      t.integer :subject_id
      t.integer :user_id
      t.integer :all_count
      t.integer :xcount
      t.timestamps null: false
    end
  end
end
