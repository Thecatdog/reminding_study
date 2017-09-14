class CreateContents < ActiveRecord::Migration
  def change
    create_table :contents do |t|
      t.integer :subject_id
      t.integer :user_id
      t.text :title
      t.string :all_content
      t.text :short_content
      t.text :long_content_q
      t.text :long_content_a
      t.timestamps null: false
    end
  end
end
