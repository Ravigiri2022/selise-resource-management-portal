class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :members, :tasks
end
