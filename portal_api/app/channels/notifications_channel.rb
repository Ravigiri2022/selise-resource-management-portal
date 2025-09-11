class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    Rails.logger.info "User ##{current_user.id} subscribed to NotificationsChannel"

    stream_for current_user
  end

  def unsubscribed
        # Any cleanup needed when channel is unsubscribed
        Rails.logger.info "User ##{current_user.id} unsubscribed"
  end
end
