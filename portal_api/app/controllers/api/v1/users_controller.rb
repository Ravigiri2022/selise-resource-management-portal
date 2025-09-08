module Api
  module V1
    class UsersController < ApplicationController
      def index
        users = User.all
        render json: users, each_serializer: UserSerializer
      end

      def show
        render json: User.find(params[:id])
      end
    end
  end
end
