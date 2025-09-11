class Task < ApplicationRecord
  belongs_to :project, optional: true
  belongs_to :assigned_user, class_name: "User", foreign_key: "assignedTo"
  belongs_to :assigned_by_user, class_name: "User", foreign_key: "assignedBy"
  # has_many :sub_topics, dependent: :destroy
  has_many :reschedule_logs, dependent: :destroy

  validates :title, :description, :assignedTo, :assignedBy, :priority, :startDate, :endDate, :pdfLink, :githubLink, :projectId, presence: true
  validates :status, inclusion: { in: %w[todo in-progress done reschedule unseen] }
  validates :priority, inclusion: { in: %w[low medium high] }
  validate :dates_order_check

  # after_create :notify_new_task
  # after_update :notify_date_change, if: :saved_change_to_start_date_or_end_date?

  private
  def dates_order_check
    return if startDate.blank? || endDate.blank?

    if startDate >= endDate
      errors.add(:startDate, "must be earlier than endDate")
    end
  end

  # def notify_new_task
  #   Notification.create!(
  #     user: user,
  #     task: self,
  #     message: "New task assigned: `#{title}`"
  #   )
  # end
  # def notify_date_change
  #   Notification.create!(
  #     user: user,
  #     task: self,
  #     message: "Task `#{title}` dates updated! Start: #{startDate}, End: #{endDate}"
  #   )
  # end
end
