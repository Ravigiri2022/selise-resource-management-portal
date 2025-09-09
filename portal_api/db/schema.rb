# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_09_09_094312) do
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
    t.string "status", default: "pending"
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
    t.string "status", default: "unseen"
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
