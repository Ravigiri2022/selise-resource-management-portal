class RescheduleLog < ApplicationRecord
  belongs_to :task, class_name: "Task", foreign_key: "taskId"

  validates :taskId, :requestedBy, :requestedById, :oldStartDate, :oldEndDate,
            :newStartDate, :newEndDate, :reason, presence: true

  validates :status, inclusion: { in: %w[pending accepted rejected] }
end
