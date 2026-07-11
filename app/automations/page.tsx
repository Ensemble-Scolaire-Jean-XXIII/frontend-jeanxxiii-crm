"use client";

import { useEffect, useState } from "react";
import { automationService } from "../services/automationService";
import { statusService } from "../services/statusService";
import { templateService } from "../services/templateService";
import { Status, EmailTemplate } from "../types";
import Toast from "../components/Toast";
import { useCrud } from "../hooks/useCrud";

interface AutomationRule {
  id: number;
  status_id: number;
  programme: string | null;
  email_template_id: string;
  delay_days: number;
}

export default function AutomationsPage() {
  const {
    data: automations,
    error,
    success,
    createForm,
    setError,
    setSuccess,
    setCreateForm,
    handleCreate,
    handleDelete,
  } = useCrud<AutomationRule, any>(automationService, {
    status_id: "",
    programme: "",
    email_template_id: "",
    delay_days: 0,
  });

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  useEffect(() => {
    const fetchSecondaryData = async () => {
      try {
        const [sData, tData] = await Promise.all([
          statusService.getAll(),
          templateService.getAll(),
        ]);
        setStatuses(sData);
        setTemplates(tData);

        if (!createForm.status_id && sData.length > 0) {
          setCreateForm((prev: any) => ({ ...prev, status_id: sData[0].id }));
        }
        if (!createForm.email_template_id && tData.length > 0) {
          setCreateForm((prev: any) => ({
            ...prev,
            email_template_id: tData[0].id,
          }));
        }
      } catch (err) {
        setError("Erreur lors du chargement des statuts ou des templates");
      }
    };
    fetchSecondaryData();
  }, [
    setError,
    setCreateForm,
    createForm.status_id,
    createForm.email_template_id,
  ]);

  const onHandleCreate = (e: React.FormEvent) => {
    const payload = { ...createForm };
    if (!payload.programme || payload.programme.trim() === "") {
      payload.programme = null;
    }
    handleCreate(e, payload);
  };

  const getStatusName = (id: number) => {
    return statuses.find((s) => s.id === id)?.name || "Inconnu";
  };

  const getTemplateName = (id: string) => {
    return templates.find((t) => t.id === id)?.name || "Inconnu";
  };

  return (
    <div className="space-y-8">
      <Toast message={error} type="error" onClose={() => setError("")} />
      <Toast message={success} type="success" onClose={() => setSuccess("")} />

      <h1 className="text-3xl font-bold text-primary dark:text-white">
        Automatisation des Emails
      </h1>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Nouvelle règle
          </h2>
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
            Nouveau
          </span>
        </div>

        <form
          onSubmit={onHandleCreate}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div>
            <label className="label-text">Statut déclencheur</label>
            <select
              className="input-field"
              value={createForm.status_id}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  status_id: Number(e.target.value),
                })
              }
              required
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Programme (Optionnel)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Maths, Info..."
              value={createForm.programme || ""}
              onChange={(e) =>
                setCreateForm({ ...createForm, programme: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label-text">Template d&#39;email</label>
            <select
              className="input-field"
              value={createForm.email_template_id}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  email_template_id: e.target.value,
                })
              }
              required
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Délai (en jours)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={createForm.delay_days}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  delay_days: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="lg:col-span-4 flex justify-end mt-2">
            <button type="submit" className="btn btn-primary">
              Ajouter la règle
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <th className="p-3 font-semibold">Statut</th>
              <th className="p-3 font-semibold">Programme</th>
              <th className="p-3 font-semibold">Template</th>
              <th className="p-3 font-semibold">Délai</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {automations.map((rule) => (
              <tr
                key={rule.id}
                className="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3 font-medium">
                  {getStatusName(rule.status_id)}
                </td>
                <td className="p-3">
                  {rule.programme ? (
                    <span className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded text-sm">
                      {rule.programme}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">Tous</span>
                  )}
                </td>
                <td className="p-3 text-primary dark:text-white">
                  {getTemplateName(rule.email_template_id)}
                </td>
                <td className="p-3 text-sm">
                  {rule.delay_days === 0 ? "Immédiat" : `J+${rule.delay_days}`}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 btn btn-ghost text-danger px-2 py-1 text-sm"
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
