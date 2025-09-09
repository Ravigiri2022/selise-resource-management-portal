class Api::V1::RescheduleLogsController < ApplicationController
    def update
      @res_log = RescheduleLog.find(params[:id])
      if @res_log.update(reslog_params)
        render json: @res_log, serializer: RescheduleLogSerializer, status: :ok
      else
        render json: { errors: @res_log.errors.full_messages },
        status: :unprocesable_entity
      end
    end

    private
    def reslog_params
      params.require(:updated_log).permit(
        :status,
        :actionBy,
        :actionMesg,
        :actionDate
      )
    end
end
