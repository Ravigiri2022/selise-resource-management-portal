export type Role = "manager" | "employee";

export type User = {
  id: number;
  name: string;
  role: Role;
  jobTitle: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: number[];
  assignedBy: number;
  startDate: string;
  endDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  subTopics?: SubTopic[];
};

export type SubTopic = {
  id: number;
  title: string;
  done: boolean;
};
