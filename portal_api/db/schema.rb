
ActiveRecord::Schema[8.0].define(version: 2025_09_08_092357) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.jsonb "members"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reschedule_logs", force: :cascade do |t|
    t.integer "taskId"
    t.string "requestedBy"
    t.integer "requestedById"
    t.datetime "oldStartDate"
    t.datetime "oldEndDate"
    t.datetime "newStartDate"
    t.datetime "newEndDate"
    t.text "reason"
    t.string "status"
    t.integer "actionBy"
    t.datetime "actionDate"
    t.text "actionMesg"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sub_topics", force: :cascade do |t|
    t.string "title"
    t.boolean "done"
    t.integer "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_sub_topics_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "assignedBy"
    t.integer "assignedTo"
    t.datetime "startDate"
    t.datetime "endDate"
    t.string "status"
    t.string "priority"
    t.string "pdfLink"
    t.string "githubLink"
    t.integer "projectId"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "role"
    t.string "jobTitle"
    t.string "colorHex"
    t.jsonb "availability"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "sub_topics", "tasks"
end
