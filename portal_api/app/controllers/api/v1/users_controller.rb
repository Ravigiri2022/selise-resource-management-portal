module Api
  module V1
    class UsersController < ApplicationController
      def index
        users = User.all
        render json: users, each_serializer: UserSerializer
      end
      def tasks
        user = User.find(params[:id])
        tasks =
        if user.role == "employee"
          Task.where(assignedTo: user.id)
        elsif user.role == "manager"
          Task.where(assignedBy: user.id)
        else
          Task.none
        end
        render json: tasks, each_serializer: TaskSerializer
      end

      def show
        render json: User.find(params[:id])
      end
    end
  end
end
