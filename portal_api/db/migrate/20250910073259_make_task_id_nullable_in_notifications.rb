class MakeTaskIdNullableInNotifications < ActiveRecord::Migration[8.0]
  def change
    change_column_null :notifications, :task_id, true
  end
end
