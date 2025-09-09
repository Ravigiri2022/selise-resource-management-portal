class ChangeDefaultStatusInTasks < ActiveRecord::Migration[8.0]
  def change
    change_column_default :tasks, :status, "unseen"
  end
end
