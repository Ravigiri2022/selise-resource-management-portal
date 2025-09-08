class User < ApplicationRecord
  has_many :assigned_tasks, class_name: "Task", foreign_key: "assignedTo"
  has_many :created_tasks, class_name: "Task", foreign_key: "assignedBy"

  validates :role, inclusion: { in: %w(manager employee) }
  validates :name, :jobTitle, :colorHex, presence: true
end
