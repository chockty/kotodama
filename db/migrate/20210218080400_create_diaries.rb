class CreateDiaries < ActiveRecord::Migration[6.0]
  def change
    create_table :diaries do |t|
      t.text :content
      t.references :user, null: false, foreign_key: true
      t.integer :question, null:false
      t.timestamps
    end
  end
end
