class RescheduleLog < ApplicationRecord
  belongs_to :task, class_name: "Task", foreign_key: "taskId"

  validates :taskId, :requestedBy, :requestedById, :oldStartDate, :oldEndDate,
            :newStartDate, :newEndDate, :reason, presence: true

  validates :status, inclusion: { in: %w[pending accepted rejected] }

  before_update :apply_reslog_logic_in_transaction, if: :will_save_change_to_status?

  private
  def apply_reslog_logic_in_transaction
    Task.transaction do
       case status
       when "accepted"
      task.update!(
        status: "todo"
      )
       when "rejected"
      task.update!(
        startDate: oldStartDate,
        endDate: oldEndDate,
        status: "todo"
      )
       end
    end
  end
end
