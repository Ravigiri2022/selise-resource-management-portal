export type Role = "manager" | "employee";

export type User = {
  id: number;
  name: string;
  role: Role;
  availability?: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  createdBy: number;
  startDate: string;
  endDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  order: number;
};
