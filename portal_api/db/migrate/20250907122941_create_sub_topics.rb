class CreateSubTopics < ActiveRecord::Migration[8.0]
  def change
    create_table :sub_topics do |t|
      t.string :title
      t.boolean :done
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end
  end
end
