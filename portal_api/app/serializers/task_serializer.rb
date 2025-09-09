class TaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :assignedBy, :assignedTo, :status, :priority,
             :startDate, :endDate, :pdfLink, :githubLink, :projectId, :created_at

             def startDate
               object.startDate&.strftime("%Y-%m-%d %H:%M")
             end
             def endDate
               object.endDate&.strftime("%Y-%m-%d %H:%M")
             end
             def created_at
               object.created_at&.strftime("%Y-%m-%d %H:%M")
             end
end
