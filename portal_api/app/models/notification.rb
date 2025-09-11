class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :task, optional: true

  after_create_commit { broadcast_notification }

  private
  def broadcast_notification
    NotificationsChannel.broadcast_to(user, { message: message, task_id: task_id })
  end
end
