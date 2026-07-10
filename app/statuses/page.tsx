"use client";

import { useEffect, useState, useCallback } from "react";
import { statusService } from "../services/statusService";
import { Status } from "../types";
import Toast from "../components/Toast";

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Status>>({});
  const [createForm, setCreateForm] = useState({ name: "", is_custom: true });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    try {
      const data = await statusService.getAll();
      setStatuses(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des statuts");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await statusService.create(createForm);
      setSuccess("Statut créé avec succès");
      setCreateForm({ name: "", is_custom: true });
      loadData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la création");
      }
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    setSuccess("");
    try {
      await statusService.delete(id);
      setSuccess("Statut supprimé");
      loadData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la suppression");
      }
    }
  };

  const startEdit = (s: Status) => {
    setError("");
    setSuccess("");
    setEditingId(s.id);
    setEditForm(s);
  };

  const saveEdit = async (id: number) => {
    setError("");
    setSuccess("");
    try {
      const payload = { ...editForm };
      delete (payload as Record<string, unknown>).id;
      await statusService.update(id, payload);
      setSuccess("Statut mis à jour avec succès");
      setEditingId(null);
      loadData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la modification");
      }
    }
  };

  return (
    <div className="space-y-8">
      <Toast message={error} type="error" onClose={() => setError("")} />
      <Toast message={success} type="success" onClose={() => setSuccess("")} />

      <h1 className="text-3xl font-bold text-primary dark:text-white">
        Statuts
      </h1>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Créer un statut
          </h2>
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
            Nouveau
          </span>
        </div>
        <form onSubmit={handleCreate} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nom du statut"
              className="input-field"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
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
              <th className="p-3 font-semibold">Nom du statut</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((s) => (
              <tr
                key={s.id}
                className="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3">
                  {editingId === s.id ? (
                    <input
                      className="input-field py-1 px-2 max-w-sm"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  ) : (
                    <span className="font-medium">{s.name}</span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${s.is_custom ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300" : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-hover"}`}
                  >
                    {s.is_custom ? "Personnalisé" : "Système"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {editingId === s.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveEdit(s.id)}
                        className="btn btn-ghost text-green-600 px-2 py-1 text-sm"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn btn-ghost text-slate-500 px-2 py-1 text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => startEdit(s)}
                        className="btn btn-ghost text-accent px-2 py-1 text-sm"
                      >
                        Corriger
                      </button>
                      {!!s.is_custom && (
                        <button
                          onClick={() => handleDelete(s.id)}
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
