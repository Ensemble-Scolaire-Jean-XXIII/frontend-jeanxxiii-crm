"use client";

import { useEffect, useState, useCallback } from "react";
import { taskService } from "../services/taskService";
import { Task } from "../types/index";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});
  const [createForm, setCreateForm] = useState({
    prospect_id: "",
    task_type: "Appel",
    due_date: "",
    is_completed: false,
    notification_email: "",
  });

  const loadData = useCallback(async () => {
    const data = await taskService.getAll();
    setTasks(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await taskService.create(createForm);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await taskService.delete(id);
    loadData();
  };

  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const saveEdit = async (id: string) => {
    const payload = { ...editForm };
    delete (payload as Record<string, unknown>).created_at;
    delete (payload as Record<string, unknown>).id;
    await taskService.update(id, payload);
    setEditingId(null);
    loadData();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Tâches</h1>

      <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold mb-4 text-secondary">Créer une tâche</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="ID Prospect"
            className="flex-1 rounded-lg border border-primary p-2 text-foreground"
            value={createForm.prospect_id}
            onChange={(e) =>
              setCreateForm({ ...createForm, prospect_id: e.target.value })
            }
            required
          />
          <select
            className="rounded-lg border border-primary p-2 text-foreground bg-transparent"
            value={createForm.task_type}
            onChange={(e) =>
              setCreateForm({ ...createForm, task_type: e.target.value })
            }
          >
            <option value="Appel">Appel</option>
            <option value="Email">Email</option>
            <option value="Réunion">Réunion</option>
          </select>
          <input
            type="date"
            className="rounded-lg border border-primary p-2 text-foreground"
            value={createForm.due_date}
            onChange={(e) =>
              setCreateForm({ ...createForm, due_date: e.target.value })
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

      <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-primary text-secondary">
              <th className="p-3 font-bold">Type</th>
              <th className="p-3 font-bold">Échéance</th>
              <th className="p-3 font-bold">Statut</th>
              <th className="p-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr
                key={t.id}
                className="border-b border-gray-200 dark:border-secondary-hover text-foreground"
              >
                {editingId === t.id ? (
                  <>
                    <td className="p-3">
                      <select
                        className="border border-primary rounded p-1 bg-transparent"
                        value={editForm.task_type || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            task_type: e.target.value,
                          })
                        }
                      >
                        <option value="Appel">Appel</option>
                        <option value="Email">Email</option>
                        <option value="Réunion">Réunion</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="date"
                        className="border border-primary rounded p-1"
                        value={
                          editForm.due_date
                            ? editForm.due_date.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setEditForm({ ...editForm, due_date: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-3">
                      <select
                        className="border border-primary rounded p-1 bg-transparent"
                        value={editForm.is_completed ? "true" : "false"}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            is_completed: e.target.value === "true",
                          })
                        }
                      >
                        <option value="false">En cours</option>
                        <option value="true">Terminé</option>
                      </select>
                    </td>
                    <td className="p-3 text-right space-x-4">
                      <button
                        onClick={() => saveEdit(t.id)}
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
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{t.task_type}</td>
                    <td className="p-3">
                      {new Date(t.due_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {t.is_completed ? "Terminé" : "En cours"}
                    </td>
                    <td className="p-3 text-right space-x-4">
                      <button
                        onClick={() => startEdit(t)}
                        className="text-accent hover:underline font-bold"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-danger hover:underline font-bold"
                      >
                        Supprimer
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
