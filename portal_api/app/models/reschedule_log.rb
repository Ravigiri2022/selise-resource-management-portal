class RescheduleLog < ApplicationRecord
  belongs_to :task

  validates :status, inclusion: { in: %w(pending accepted rejected) }
end
