import { api } from "./api";

export const taskTypeService = {
  getAll: () => api.get("/task-types"),
  create: (data: { name: string }) => api.post("/task-types", data),
  update: (id: number, data: { name: string }) =>
    api.put(`/task-types/${id}`, data),
  delete: (id: number) => api.delete(`/task-types/${id}`),
};
