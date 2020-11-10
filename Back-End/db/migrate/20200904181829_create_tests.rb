class CreateTests < ActiveRecord::Migration[6.0]
  def change
    create_table :tests do |t|
      t.text :paragraph

      t.timestamps
    end
  end
end
