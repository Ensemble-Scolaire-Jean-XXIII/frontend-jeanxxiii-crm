"use client";

import { useEffect, useState, useCallback } from "react";
import { taskService } from "../services/taskService";
import { prospectService } from "../services/prospectService";
import { Task, Prospect } from "../types/index";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [createForm, setCreateForm] = useState({
    prospect_id: "",
    task_type: "Appel",
    due_date: "",
    is_completed: false,
    notification_email: "",
  });

  const loadData = useCallback(async () => {
    const [tData, pData] = await Promise.all([
      taskService.getAll(),
      prospectService.getAll(),
    ]);

    const sortedProspects = pData.sort((a: Prospect, b: Prospect) =>
      a.last_name.localeCompare(b.last_name),
    );

    setTasks(tData);
    setProspects(sortedProspects);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await taskService.create(createForm);
    setCreateForm({
      prospect_id: "",
      task_type: "Appel",
      due_date: "",
      is_completed: false,
      notification_email: "",
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    await taskService.delete(id);
    loadData();
  };

  const handleUpdate = async (
    id: string,
    field: string,
    value: string | boolean,
  ) => {
    await taskService.update(id, { [field]: value });
    loadData();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary dark:text-white">
        Tâches
      </h1>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Créer une tâche
          </h2>
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
            Nouveau
          </span>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="label-text">Prospect</label>
            <select
              className="input-field"
              value={createForm.prospect_id}
              onChange={(e) =>
                setCreateForm({ ...createForm, prospect_id: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Sélectionner un prospect
              </option>
              {prospects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.last_name} {p.first_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Type</label>
            <select
              className="input-field"
              value={createForm.task_type}
              onChange={(e) =>
                setCreateForm({ ...createForm, task_type: e.target.value })
              }
            >
              <option value="Appel">Appel</option>
              <option value="Email">Email</option>
              <option value="Réunion">Réunion</option>
            </select>
          </div>
          <div>
            <label className="label-text">Échéance</label>
            <input
              type="date"
              className="input-field"
              value={createForm.due_date}
              onChange={(e) =>
                setCreateForm({ ...createForm, due_date: e.target.value })
              }
              required
            />
          </div>

          <div className="md:col-span-3 flex justify-end mt-2">
            <button type="submit" className="btn btn-primary">
              Créer
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Échéance</th>
              <th className="p-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr
                key={t.id}
                className="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3">
                  <select
                    className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm cursor-pointer outline-none transition-colors"
                    value={t.task_type}
                    onChange={(e) =>
                      handleUpdate(t.id, "task_type", e.target.value)
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
                    className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm cursor-pointer outline-none transition-colors"
                    value={
                      t.due_date ? t.due_date.toString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                      handleUpdate(t.id, "due_date", e.target.value)
                    }
                  />
                </td>
                <td className="p-3">
                  <select
                    className={`bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm font-medium cursor-pointer outline-none transition-colors ${
                      t.is_completed
                        ? "text-green-700 dark:text-green-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    value={t.is_completed ? "true" : "false"}
                    onChange={(e) =>
                      handleUpdate(
                        t.id,
                        "is_completed",
                        e.target.value === "true",
                      )
                    }
                  >
                    <option value="false">En cours</option>
                    <option value="true">Terminé</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 btn btn-ghost text-danger px-2 py-1"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
