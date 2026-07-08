"use client";

import { useEffect, useState, useCallback } from "react";
import { userService } from "../services/userService";
import { User } from "../types/index";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [createForm, setCreateForm] = useState({
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    role: "user",
  });

  const loadData = useCallback(async () => {
    const data = await userService.getAll();
    setUsers(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await userService.create(createForm);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await userService.delete(id);
    loadData();
  };

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setEditForm(u);
  };

  const saveEdit = async (id: string) => {
    try {
      const payload = { ...editForm };
      delete (payload as Record<string, unknown>).created_at;
      delete (payload as Record<string, unknown>).id;
      delete (payload as Record<string, unknown>).password_hash;

      await userService.update(id, payload);
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error("Détails de l'erreur :", error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Utilisateurs</h1>

      <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold mb-4 text-secondary">
          Ajouter un utilisateur
        </h2>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Prénom"
            className="flex-1 rounded-lg border border-primary p-2 text-foreground"
            value={createForm.first_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, first_name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Nom"
            className="flex-1 rounded-lg border border-primary p-2 text-foreground"
            value={createForm.last_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, last_name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="flex-1 rounded-lg border border-primary p-2 text-foreground"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="flex-1 rounded-lg border border-primary p-2 text-foreground"
            value={createForm.password_hash}
            onChange={(e) =>
              setCreateForm({ ...createForm, password_hash: e.target.value })
            }
            required
          />
          <select
            className="rounded-lg border border-primary p-2 text-foreground bg-transparent"
            value={createForm.role}
            onChange={(e) =>
              setCreateForm({ ...createForm, role: e.target.value })
            }
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded-lg font-bold hover:opacity-90"
          >
            Créer
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-secondary rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-4 border-b border-gray-200 dark:border-secondary-hover last:border-0 flex justify-between items-center text-foreground"
          >
            {editingId === u.id ? (
              <>
                <div className="flex gap-2 w-full max-w-lg">
                  <input
                    className="border border-primary rounded p-1 flex-1"
                    value={editForm.first_name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                  />
                  <input
                    className="border border-primary rounded p-1 flex-1"
                    value={editForm.last_name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                  />
                  <select
                    className="border border-primary rounded p-1 bg-transparent"
                    value={editForm.role || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => saveEdit(u.id)}
                    className="text-green-600 hover:underline font-bold"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-secondary hover:underline font-bold"
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <span className="font-bold">
                    {u.first_name} {u.last_name} ({u.email})
                  </span>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                    {u.role}
                  </span>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => startEdit(u)}
                    className="text-accent hover:underline font-bold"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-danger hover:underline font-bold"
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
