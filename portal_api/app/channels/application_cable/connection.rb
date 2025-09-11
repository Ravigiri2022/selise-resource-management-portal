# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      # Example using Devise token or session:
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      user_id = request.params[:user_id] # from query params in ws URL
      if user_id && (verified_user = User.find_by(id: user_id))
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
