class CreateLineaccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :lineaccounts do |t|
      t.string :uid, null: false
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
