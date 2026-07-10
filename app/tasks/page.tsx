"use client";

import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import { prospectService } from "../services/prospectService";
import { Task, Prospect, TaskType } from "../types/index";
import { taskTypeService } from "../services/taskTypeService";
import Toast from "../components/Toast";
import { useCrud } from "../hooks/useCrud";

export default function TasksPage() {
  const taskCrud = useCrud<Task, any>(taskService, {
    prospect_id: "",
    task_type_id: "",
    due_date: "",
    due_time: "12:00",
    is_completed: false,
  });

  const typeCrud = useCrud<TaskType, { name: string }>(taskTypeService, {
    name: "",
  });

  const [prospects, setProspects] = useState<Prospect[]>([]);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const pData = await prospectService.getAll();
        const sortedProspects = pData.sort((a: Prospect, b: Prospect) =>
          a.last_name.localeCompare(b.last_name),
        );
        setProspects(sortedProspects);
      } catch (err) {
        taskCrud.setError("Erreur lors du chargement des prospects");
      }
    };
    fetchProspects();
  }, [taskCrud]);

  useEffect(() => {
    if (typeCrud.data.length > 0 && !taskCrud.createForm.task_type_id) {
      taskCrud.setCreateForm((prev: any) => ({
        ...prev,
        task_type_id: String(typeCrud.data[0].id),
      }));
    }
  }, [typeCrud.data, taskCrud]);

  const onHandleCreateTask = (e: React.FormEvent) => {
    const fullDateTime = `${taskCrud.createForm.due_date}T${taskCrud.createForm.due_time}:00`;
    taskCrud.handleCreate(e, {
      prospect_id: taskCrud.createForm.prospect_id,
      task_type_id: Number(taskCrud.createForm.task_type_id),
      due_date: fullDateTime,
      is_completed: taskCrud.createForm.is_completed,
    });
  };

  return (
    <div className="space-y-8">
      <Toast
        message={taskCrud.error || typeCrud.error}
        type="error"
        onClose={() => {
          taskCrud.setError("");
          typeCrud.setError("");
        }}
      />
      <Toast
        message={taskCrud.success || typeCrud.success}
        type="success"
        onClose={() => {
          taskCrud.setSuccess("");
          typeCrud.setSuccess("");
        }}
      />

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
          onSubmit={onHandleCreateTask}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="label-text">Prospect</label>
            <select
              className="input-field"
              value={taskCrud.createForm.prospect_id}
              onChange={(e) =>
                taskCrud.setCreateForm({
                  ...taskCrud.createForm,
                  prospect_id: e.target.value,
                })
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
              value={taskCrud.createForm.task_type_id}
              onChange={(e) =>
                taskCrud.setCreateForm({
                  ...taskCrud.createForm,
                  task_type_id: e.target.value,
                })
              }
              required
            >
              <option value="" disabled>
                Sélectionner un type
              </option>
              {typeCrud.data.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Échéance</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="input-field"
                value={taskCrud.createForm.due_date}
                onChange={(e) =>
                  taskCrud.setCreateForm({
                    ...taskCrud.createForm,
                    due_date: e.target.value,
                  })
                }
                required
              />
              <input
                type="time"
                className="input-field"
                value={taskCrud.createForm.due_time}
                onChange={(e) =>
                  taskCrud.setCreateForm({
                    ...taskCrud.createForm,
                    due_time: e.target.value,
                  })
                }
                required
              />
            </div>
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
              <th className="p-3 font-semibold">Prospect</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Échéance</th>
              <th className="p-3 font-semibold">Statut</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskCrud.data.map((t) => (
              <tr
                key={t.id}
                className="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3">
                  <select
                    className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm cursor-pointer outline-none transition-colors font-medium text-primary dark:text-white"
                    value={t.prospect_id ?? ""}
                    onChange={(e) =>
                      taskCrud.handleUpdateField(
                        t.id,
                        "prospect_id",
                        e.target.value,
                      )
                    }
                  >
                    {prospects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.last_name} {p.first_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <select
                    className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm cursor-pointer outline-none transition-colors"
                    value={t.task_type_id ?? ""}
                    onChange={(e) =>
                      taskCrud.handleUpdateField(
                        t.id,
                        "task_type_id",
                        Number(e.target.value),
                      )
                    }
                  >
                    {typeCrud.data.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="datetime-local"
                    className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm cursor-pointer outline-none transition-colors"
                    value={
                      t.due_date
                        ? new Date(t.due_date).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      taskCrud.handleUpdateField(
                        t.id,
                        "due_date",
                        e.target.value,
                      )
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
                      taskCrud.handleUpdateField(
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
                    onClick={() => taskCrud.handleDelete(t.id)}
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

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Créer un type de tâche
          </h2>
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
            Nouveau
          </span>
        </div>
        <form onSubmit={typeCrud.handleCreate} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nom du type (ex: Appel, Email...)"
              className="input-field"
              value={typeCrud.createForm.name}
              onChange={(e) =>
                typeCrud.setCreateForm({
                  ...typeCrud.createForm,
                  name: e.target.value,
                })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Créer
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <th className="p-3 font-semibold">Nom du type</th>
              <th className="p-3 font-semibold">Catégorie</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {typeCrud.data.map((t) => (
              <tr
                key={t.id}
                className="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3">
                  {typeCrud.editingId === t.id ? (
                    <input
                      className="input-field py-1 px-2 max-w-sm"
                      value={typeCrud.editForm.name || ""}
                      onChange={(e) =>
                        typeCrud.setEditForm({
                          ...typeCrud.editForm,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span className="font-medium">{t.name}</span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${t.is_custom ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300" : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-hover"}`}
                  >
                    {t.is_custom ? "Personnalisé" : "Système"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {typeCrud.editingId === t.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => typeCrud.saveEdit(t.id)}
                        className="btn btn-ghost text-green-600 px-2 py-1 text-sm"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => typeCrud.setEditingId(null)}
                        className="btn btn-ghost text-slate-500 px-2 py-1 text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => typeCrud.startEdit(t)}
                        className="btn btn-ghost text-accent px-2 py-1 text-sm"
                      >
                        Corriger
                      </button>
                      {!!t.is_custom && (
                        <button
                          onClick={() => typeCrud.handleDelete(t.id)}
                          className="btn btn-ghost text-danger px-2 py-1 text-sm"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
