class CreateFunctions < ActiveRecord::Migration[6.0]
  def change
    create_table :functions do |t|
      t.integer :line_remind, null: false, default: 0
      t.integer :mail_remind, null: false, default: 0
      t.integer :diary_mode,  null: false, default: 0
      t.integer :memo_mode,   null: false, default: 0
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
