class RescheduleLogSerializer < ActiveModel::Serializer
  attributes :id, :taskId, :requestedBy, :requestedById,
             :oldStartDate, :oldEndDate, :newStartDate, :newEndDate,
             :reason, :status, :actionBy, :actionDate, :actionMesg, :created_at

             def oldStartDate
               object.oldStartDate&.strftime("%Y-%m-%d %H:%M")
             end
             def oldEndDate
               object.oldEndDate&.strftime("%Y-%m-%d %H:%M")
             end
             def newStartDate
               object.newStartDate&.strftime("%Y-%m-%d %H:%M")
             end
             def newEndDate
               object.newEndDate&.strftime("%Y-%m-%d %H:%M")
             end
             def actionDate
               object.actionDate&.strftime("%Y-%m-%d")
             end
             def created_at
               object.created_at&.strftime("%Y-%m-%d")
             end
end
