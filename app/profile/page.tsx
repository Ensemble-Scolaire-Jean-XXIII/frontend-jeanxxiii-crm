"use client";

import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { User } from "../types/index";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const data = await userService.getMe();
      setUser(data);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      });
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await userService.updateMe(formData);
    alert("Profil mis à jour");
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-primary dark:text-white">
        Mon Profil
      </h1>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Prénom</label>
              <input
                type="text"
                className="input-field"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label-text">Nom</label>
              <input
                type="text"
                className="input-field"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="label-text">Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label-text">Rôle</label>
            <input
              type="text"
              className="input-field bg-slate-50"
              value={user?.role}
              disabled
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
