class ChangeDefaultStatusInResLog < ActiveRecord::Migration[8.0]
  def change
    change_column_default :reschedule_logs, :status, "pending"
  end
end
