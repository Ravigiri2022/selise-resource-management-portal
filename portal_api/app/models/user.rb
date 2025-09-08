class User < ApplicationRecord
  before_create :assign_random_color
  has_many :assigned_tasks, class_name: "Task", foreign_key: "assignedTo"
  has_many :created_tasks, class_name: "Task", foreign_key: "assignedBy"

  validates :role, inclusion: { in: %w(manager employee) }
  validates :name, :jobTitle, presence: true

  private
  def assign_random_color
    def random_dark_color 
      r= rand(0..100)
      g= rand(0..100)
      b = rand(0..100)
      format("#%02x%02x%02x", r, g, b)
    end

    self.colorHex ||= random_dark_color
  end
end
