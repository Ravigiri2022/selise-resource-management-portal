class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.jsonb :members

      t.timestamps
    end
  end
end
