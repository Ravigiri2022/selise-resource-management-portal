class Task < ApplicationRecord
  belongs_to :project
  has_many :sub_topics, dependent: :destroy
  has_many :reschedule_logs, dependent: :destroy

  validates :status, inclusion: { in: %w(todo in-progress done reschedule unseen) }
  validates :priority, inclusion: { in: %w(low medium high) }
end
