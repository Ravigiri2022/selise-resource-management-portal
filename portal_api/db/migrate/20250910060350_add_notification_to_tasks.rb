class AddNotificationToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :notified, :boolean
  end
end
