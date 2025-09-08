class TaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :assignedBy, :assignedTo, :status, :priority,
             :startDate, :endDate, :createdDate, :pdfLink, :githubLink, :projectId
end
