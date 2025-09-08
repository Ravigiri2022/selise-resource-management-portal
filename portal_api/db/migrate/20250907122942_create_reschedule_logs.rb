class CreateRescheduleLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :reschedule_logs do |t|
      t.integer :taskId
      t.string :requestedBy
      t.integer :requestedById
      t.datetime :createdAt
      t.datetime :oldStartDate
      t.datetime :oldEndDate
      t.datetime :newStartDate
      t.datetime :newEndDate
      t.text :reason
      t.string :status
      t.integer :actionBy
      t.datetime :actionDate
      t.text :actionMesg
      t.integer :rescheduleLogId

      t.timestamps
    end
  end
end
