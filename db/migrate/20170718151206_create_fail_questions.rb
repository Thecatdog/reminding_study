class CreateFailQuestions < ActiveRecord::Migration
  def change
    create_table :fail_questions do |t|
      t.integer :subject_id
      t.integer :user_id
      t.text :f_q_content
      t.timestamps null: false
    end
  end
end
