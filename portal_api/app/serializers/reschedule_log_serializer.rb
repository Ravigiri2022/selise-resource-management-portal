class RescheduleLogSerializer < ActiveModel::Serializer
  attributes :id, :taskId, :requestedBy, :requestedById, :createdAt,
             :oldStartDate, :oldEndDate, :newStartDate, :newEndDate,
             :reason, :status, :rescheduleLogId, :actionBy, :actionDate, :actionMesg
end
