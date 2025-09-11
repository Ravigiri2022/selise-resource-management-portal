# db/seeds.rb

puts "🌱 Seeding database..."

# Clear existing data
Notification.destroy_all
RescheduleLog.destroy_all
Task.destroy_all
User.destroy_all
Project.destroy_all

# -------------------
# Projects
# -------------------
projects = Project.create!([
  { name: "Project 1" },
  { name: "Website Redesign" },
  { name: "Mobile App Development" }
])

# -------------------
# Users
# -------------------
users = User.create!([
  { name: "Ravi Giri", role: "employee", jobTitle: "Software Engineer", colorHex: "#3e1b03" },
  { name: "Pema Wangchuk", role: "employee", jobTitle: "UI Designer", colorHex: "#023e46" },
  { name: "Tashi Dorji", role: "employee", jobTitle: "Frontend Developer", colorHex: "#1d010f" },
  { name: "Deki Yuden", role: "manager", jobTitle: "Project Manager", colorHex: "#5f1007" },
  { name: "Sonam Choden", role: "employee", jobTitle: "Backend Developer", colorHex: "#8c1aff" },
  { name: "Karma Phuntsho", role: "manager", jobTitle: "Senior Project Manager", colorHex: "#0a3d62" }
])

# -------------------
# Tasks
# -------------------
tasks = Task.create!([
  {
    title: "Database Schema Setup",
    description: "Design initial schema for users and tasks",
    assignedBy: users[3].id, # Deki (manager)
    assignedTo: users[2].id, # Tashi (frontend dev)
    startDate: Date.today - 10,
    endDate: Date.today - 2,
    status: "done",
    priority: "high",
    pdfLink: "http://example.com/specs.pdf",
    githubLink: "https://github.com/example/project1",
    projectId: projects[0].id
  },
  {
    title: "API Testing",
    description: "Write unit tests for backend API",
    assignedBy: users[3].id,
    assignedTo: users[0].id, # Ravi
    startDate: Date.today - 5,
    endDate: Date.today + 2,
    status: "in-progress",
    priority: "medium",
    pdfLink: "http://example.com/specs.pdf",
    githubLink: "https://github.com/example/project1",
    projectId: projects[0].id
  },
  {
    title: "UI Wireframes",
    description: "Design wireframes for homepage",
    assignedBy: users[5].id, # Karma (manager)
    assignedTo: users[1].id, # Pema
    startDate: Date.today,
    endDate: Date.today + 7,
    status: "todo",
    priority: "high",
    pdfLink: "http://example.com/wireframes.pdf",
    githubLink: "https://github.com/example/project2",
    projectId: projects[1].id
  },
  {
    title: "API Endpoints",
    description: "Implement authentication endpoints",
    assignedBy: users[5].id,
    assignedTo: users[4].id, # Sonam
    startDate: Date.today + 1,
    endDate: Date.today + 10,
    status: "unseen",
    priority: "high",
    pdfLink: "http://example.com/api.pdf",
    githubLink: "https://github.com/example/project2",
    projectId: projects[1].id
  },
  {
    title: "Frontend Integration",
    description: "Integrate UI with API",
    assignedBy: users[3].id,
    assignedTo: users[0].id, # Ravi
    startDate: Date.today + 2,
    endDate: Date.today + 12,
    status: "reschedule",
    priority: "low",
    pdfLink: "http://example.com/integration.pdf",
    githubLink: "https://github.com/example/project3",
    projectId: projects[2].id
  }
])

# -------------------
# Reschedule Logs
# -------------------
RescheduleLog.create!([
  {
    taskId: tasks[4].id,
    requestedBy: "employee",
    requestedById: users[0].id, # Ravi
    oldStartDate: Date.today + 2,
    oldEndDate: Date.today + 12,
    newStartDate: Date.today + 5,
    newEndDate: Date.today + 15,
    reason: "Need more time for frontend integration",
    status: "pending",
    actionBy: nil,
    actionDate: nil,
    actionMesg: nil
  },
  {
    taskId: tasks[1].id,
    requestedBy: "employee",
    requestedById: users[0].id,
    oldStartDate: Date.today - 5,
    oldEndDate: Date.today + 2,
    newStartDate: Date.today - 4,
    newEndDate: Date.today + 3,
    reason: "Shift due to dependency delays",
    status: "accepted",
    actionBy: users[3].id,
    actionDate: Date.today,
    actionMesg: "Approved, proceed"
  },
  {
    taskId: tasks[2].id,
    requestedBy: "employee",
    requestedById: users[1].id,
    oldStartDate: Date.today,
    oldEndDate: Date.today + 7,
    newStartDate: Date.today + 1,
    newEndDate: Date.today + 8,
    reason: "Personal leave",
    status: "rejected",
    actionBy: users[5].id,
    actionDate: Date.today,
    actionMesg: "Not possible, deadline fixed"
  }
])

# -------------------
# Notifications (sample)
# -------------------
Notification.create!([
  { user_id: users[0].id, message: "New task assigned: API Testing", read: false },
  { user_id: users[1].id, message: "Task UI Wireframes deadline in 2 days", read: false },
  { user_id: users[3].id, message: "Reschedule request pending for Frontend Integration", read: false }
])

puts "✅ Seeding complete!"
