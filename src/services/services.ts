import api from "./api";

export const taskService = {
  getAll: async () => {
    const res = await api.get("api/v1/tasks");
    return res.data;
  },
  getResLogsById: async (id: unknown) => {
    const res = await api.get(`api/v1/tasks/${id}/logs`);
    return res.data;
  },

  create: async (task: unknown) => {
    const res = await api.post("api/v1/tasks", task);
    return res.data;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await api.patch(`api/v1/tasks/${id}`, {
      task: { status: status },
    });
    return res.data;
  },
};

export const logService = {
  create: async (log: unknown) => {
    const res = await api.post("/api/v1/reschedule_logs", log);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get("/rescheduleLogs");
    return res.data;
  },

  update: async (id: number, task: unknown) => {
    const res = await api.put(`/rescheduleLogs/?id=${id}`, task);
    return res.data;
  },
  patch: async (id: number, updated_log: unknown) => {
    const res = await api.put(`api/v1/reschedule_logs/${id}`, updated_log);
    return res.data;
  },
};

// User Service
export const userService = {
  getAll: async () => {
    const res = await api.get("/api/v1/users");
    return res.data;
  },

  getTaskById: async (id: unknown) => {
    const res = await api.get(`/api/v1/users/${id}/tasks`);
    return res.data;
  },
};

export const projectService = {
  getAll: async () => {
    const res = await api.get("/api/v1/projects");
    return res.data;
  },
  getTasksByProjectId: async (id: unknown) => {
    const res = await api.get(`/api/v1/projects/${id}/tasks`);
    return res.data;
  },
  create: async (project: unknown) => {
    const res = await api.post("api/v1/projects", project);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get(`api/v1/projects/${id}`);
    return res.data;
  },
};
