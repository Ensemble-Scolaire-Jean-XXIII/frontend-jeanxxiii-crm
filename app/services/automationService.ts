import { api } from "./api";

export const automationService = {
  getAll: () => api.get("/automations"),
  create: (data: unknown) => api.post("/automations", data),
  delete: (id: number) => api.delete(`/automations/${id}`),
};
