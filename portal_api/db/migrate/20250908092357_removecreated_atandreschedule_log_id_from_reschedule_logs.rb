class RemovecreatedAtandrescheduleLogIdFromRescheduleLogs < ActiveRecord::Migration[8.0]
  def change
        remove_column :reschedule_logs, :createdAt, :datetime
        remove_column :reschedule_logs, :rescheduleLogId, :integer
  end
end
