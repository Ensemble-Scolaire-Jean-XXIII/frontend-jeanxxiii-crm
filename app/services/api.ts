const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`,
});

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erreur API (${res.status}) sur ${endpoint} :`, errorText);
      throw new Error(`Erreur API : ${res.status}`);
    }
    return res.json();
  },
  post: async (endpoint: string, data: unknown) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erreur API (${res.status}) sur ${endpoint} :`, errorText);
      throw new Error(`Erreur API : ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  },
  put: async (endpoint: string, data: unknown) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erreur API (${res.status}) sur ${endpoint} :`, errorText);
      throw new Error(`Erreur API : ${res.status}`);
    }
  },
  delete: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erreur API (${res.status}) sur ${endpoint} :`, errorText);
      throw new Error(`Erreur API : ${res.status}`);
    }
  },
};
