class Api::V1::TasksController < ApplicationController
  def logs
    logs = RescheduleLog.where(taskId: params[:id])
    render json: logs, each_serializer: RescheduleLogSerializer
  end

  def update
    @task = Task.find(params[:id])
    if @task.update(task_params)
      render json: @task, serializer: TaskSerializer, status: :ok
    else
      render json: { errors: @task.errors.full_messages },
      status: :unprocesable_entity
    end
  end

  private
  def task_params
    params.require(:task).permit(
         :title,
         :description,
         :assignedBy,
         :assignedTo,
         :startDate,
         :endDate,
         :status,
         :priority,
         :pdfLink,
         :githubLink,
         :projectId
    )
  end
end
