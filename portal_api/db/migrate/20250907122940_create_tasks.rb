class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.integer :assignedBy
      t.integer :assignedTo
      t.datetime :startDate
      t.datetime :endDate
      t.string :status
      t.string :priority
      t.date :createdDate
      t.string :pdfLink
      t.string :githubLink
      t.integer :projectId

      t.timestamps
    end
  end
end
