class Api::V1::RescheduleLogsController < ApplicationController
    def create
      @res_log = RescheduleLog.new(new_reslog_params)
       Rails.logger.info "Params: #{new_reslog_params.inspect}"
  Rails.logger.info "Valid? #{@res_log.valid?}, Errors: #{@res_log.errors.full_messages.inspect}"

    if @res_log.save
      render json: @res_log, each_serializer: RescheduleLogSerializer, status: :created
    else
      render json: { errors: @res_log.errors.full_messages }, status: :unprocessable_entity
    end
    end


    def update
      @res_log = RescheduleLog.find(params[:id])
      if @res_log.update(reslog_params)
        render json: @res_log, serializer: RescheduleLogSerializer, status: :ok
      else
        render json: { errors: @res_log.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private
    def reslog_params
      params.require(:updated_log).permit(
        :status,
        :actionBy,
        :actionMesg,
        :actionDate,
      )
    end

    def new_reslog_params
      params.require(:log).permit(
        :newEndDate,
        :newStartDate,
        :oldEndDate,
        :oldStartDate,
        :requestedBy,
        :requestedById,
        :taskId,
        :reason,
      )
    end
end
