class RemoveCreatedDataFromTasks < ActiveRecord::Migration[8.0]
  def change
    remove_column :tasks, :createdDate, :datetime
  end
end
