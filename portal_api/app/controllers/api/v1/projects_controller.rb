class Api::V1::ProjectsController < ApplicationController
  def create
    @project = Project.new(project_params)

    if @project.save
      render json: @project, each_serializer: ProjectSerializer, status: :created
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity

    end
  end
  def index
    project = Project.all
    render json: project, each_serializer: ProjectSerializer
  end


  def show
    @project = Project.find(params[:id])
    render json: @project, each_serializer: ProjectSerializer
  end
  def tasks
    # project = Project.find(params[:id])
    tasks = Task.where(projectId: params[:id])
    render json: tasks, each_serializer: TaskSerializer
  end

    private
  def project_params
    params.require(:project).permit(
        :name
    )
  end
end
