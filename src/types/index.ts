export type Role = "manager" | "employee";

export type User = {
  id: number;
  name: string;
  role: Role;
  jobTitle: string;
  colorHex: string;
};

export interface Notification {
  id: number;
  message: string;
  task_id: number | null;
  read: boolean;
}

export interface Project {
  id: number;
  name: string;
}

export type resLog = {
  id: number;
  taskId: number;
  requestedBy: string;
  requestedById: number;
  created_at: string;
  oldStartDate: string;
  oldEndDate: string;
  newStartDate: string;
  newEndDate: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
  actionBy?: number;
  actionDate?: string;
  actionMesg?: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  assignedBy: number;
  startDate: string;
  endDate: string;
  status: "todo" | "in-progress" | "done" | "reschedule" | "unseen";
  priority: "low" | "medium" | "high";
  created_at: string;
  pdfLink: string;
  githubLink: string;
  projectId: number;
  // subTopics: SubTopic[];
};

export type SubTopic = {
  id: number;
  title: string;
  done: boolean;
};

export interface FormValues {
  title: string;
  desc: string;
  assignedTo: { userId: number; name: string }[];
  startDate: string;
  endDate: string;
  priority: string;
  miniTasks: { task: string }[];
  pdfLink: string;
  githubLink: string;
}
