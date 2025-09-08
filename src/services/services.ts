import api from "./api";

export const taskService = {
  getAll: async () => {
    const res = await api.get("/tasks");
    return res.data;
  },

  //   getById: async (id: string | number) => {
  //     const res = await api.get(`/tasks/${id}`);
  //     return res.data;
  //   },

  create: async (task: any) => {
    const res = await api.post("/tasks", task);
    return res.data;
  },

  //   update: async (id: number, task: any) => {
  //     const res = await api.put(`/tasks/?id=${id}`, task);
  //     return res.data;
  //   },

  //   updateStatus: async (id: number, status: string) => {
  //     const res = await api.patch(`/tasks/${id}`, { status });
  //     return res.data;
  //   },
  //   delete: async (id: number) => {
  //     await api.delete(`/tasks/${id}`);
  //   },
};

export const logService = {
  getAll: async () => {
    const res = await api.get("/rescheduleLogs");
    return res.data;
  },

  //   getById: async (id: string | number) => {
  //     const res = await api.get(`/rescheduleLogs/${id}`);
  //     return res.data;
  //   },

  //   create: async (task: any) => {
  //     const res = await api.post("/rescheduleLogs", task);
  //     return res.data;
  //   },

  update: async (id: number, task: any) => {
    const res = await api.put(`/rescheduleLogs/?id=${id}`, task);
    return res.data;
  },

  //   updateStatus: async (id: number, status: string) => {
  //     const res = await api.patch(`/rescheduleLogs/${id}`, { status });
  //     return res.data;
  //   },
  //   delete: async (id: number) => {
  //     await api.delete(`/rescheduleLogs/${id}`);
  //   },
};

// User Service
export const userService = {
  getAll: async () => {
    const res = await api.get("/api/v1/users");
    return res.data;
  },

  // getById: async (id: string | number) => {
  //   const res = await api.get(`/tasks/${id}`);
  //   return res.data;
  // },

  // create: async (task: any) => {
  //   const res = await api.post("/tasks", task);
  //   return res.data;
  // },

  // update: async (id: number, task: any) => {
  //   const res = await api.put(`/tasks/?id=${id}`, task);
  //   return res.data;
  // },

  // updateStatus: async (id: number, status: string) => {
  //   const res = await api.patch(`/tasks/${id}`, { status });
  //   return res.data;
  // },
  // delete: async (id: number) => {
  //   await api.delete(`/tasks/${id}`);
  // },
};
