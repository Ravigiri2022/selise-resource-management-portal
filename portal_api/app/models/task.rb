class Task < ApplicationRecord
  # belongs_to :project, optional: true
  belongs_to :assigned_user, class_name: "User", foreign_key: "assignedTo"
  belongs_to :assigned_by_user, class_name: "User", foreign_key: "assignedBy"
  # has_many :sub_topics, dependent: :destroy
  has_many :reschedule_logs, dependent: :destroy

  validates :title, :description, :assignedTo, :assignedBy, :status, :priority, :startDate, :endDate, presence: true
  validates :status, inclusion: { in: %w[todo in-progress done reschedule unseen] }
  validates :priority, inclusion: { in: %w[low medium high] }
  validate :dates_order_check

  private
  def dates_order_check
    return if startDate.blank? || endDate.blank?

    if startDate >= endDate
      errors.add(:startDate, "must be earlier than endDate")
    end
  end
end
