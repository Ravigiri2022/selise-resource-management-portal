export type Role = "manager" | "employee";

export type User = {
  id: number;
  name: string;
  role: Role;
  jobTitle: string;
  colorHex: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  assignedBy: number;
  startDate: string;
  endDate: string;
  status: "pending" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  createdDate: string;
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
