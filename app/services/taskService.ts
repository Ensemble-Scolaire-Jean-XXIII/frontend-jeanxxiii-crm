import { api } from "./api";

export const taskService = {
  getAll: () => api.get("/tasks"),
  create: (data: unknown) => api.post("/tasks", data),
  update: (id: string, data: unknown) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};
