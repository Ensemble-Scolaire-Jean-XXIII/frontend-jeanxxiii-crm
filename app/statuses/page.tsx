"use client";

import { useEffect, useState, useCallback } from "react";
import { statusService } from "../services/statusService";
import { Status } from "../types";

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Status>>({});
  const [createForm, setCreateForm] = useState({ name: "", is_custom: true });

  const loadData = useCallback(async () => {
    const data = await statusService.getAll();
    setStatuses(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await statusService.create(createForm);
    setCreateForm({ name: "", is_custom: true });
    loadData();
  };

  const handleDelete = async (id: number) => {
    await statusService.delete(id);
    loadData();
  };

  const startEdit = (s: Status) => {
    setEditingId(s.id);
    setEditForm(s);
  };

  const saveEdit = async (id: number) => {
    const payload = { ...editForm };
    delete (payload as Record<string, unknown>).id;
    await statusService.update(id, payload);
    setEditingId(null);
    loadData();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Statuts</h1>

      <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold mb-4 text-secondary">Créer un statut</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            placeholder="Nom du statut"
            className="flex-1 rounded-lg border border-primary p-2 text-foreground"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded-lg font-bold hover:opacity-90"
          >
            Créer
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-secondary rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {statuses.map((s) => (
          <div
            key={s.id}
            className="p-4 border-b border-gray-200 dark:border-secondary-hover last:border-0 flex justify-between items-center text-foreground"
          >
            {editingId === s.id ? (
              <>
                <input
                  className="border border-primary rounded p-1 flex-1 max-w-sm"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <div className="space-x-4">
                  <button
                    onClick={() => saveEdit(s.id)}
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
                <span className="font-medium">
                  {s.name} {s.is_custom ? "" : "(Système)"}
                </span>
                <div className="space-x-4">
                  <button
                    onClick={() => startEdit(s)}
                    className="text-accent hover:underline font-bold"
                  >
                    Modifier
                  </button>
                  {!!s.is_custom && (
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-danger hover:underline font-bold"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
