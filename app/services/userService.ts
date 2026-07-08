import { api } from "./api";

export const userService = {
  login: async (email: string, password_hash: string) => {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password_hash }),
    });
    if (!res.ok) throw new Error("Identifiants invalides");
    return res.json();
  },
  getAll: () => api.get("/users"),
  create: (data: unknown) => api.post("/users", data),
  update: (id: string, data: unknown) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
