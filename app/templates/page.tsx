"use client";

import { useEffect, useState, useCallback } from "react";
import { templateService } from "../services/templateService";
import { EmailTemplate } from "../types/index";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EmailTemplate>>({});
  const [createForm, setCreateForm] = useState({
    name: "",
    subject: "",
    body: "",
  });

  const loadData = useCallback(async () => {
    const data = await templateService.getAll();
    setTemplates(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await templateService.create(createForm);
    setCreateForm({ name: "", subject: "", body: "" });
    loadData();
  };

  const handleDelete = async (id: string) => {
    await templateService.delete(id);
    loadData();
  };

  const startEdit = (t: EmailTemplate) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const saveEdit = async (id: string) => {
    const payload = { ...editForm };
    delete (payload as Record<string, unknown>).created_at;
    delete (payload as Record<string, unknown>).id;
    await templateService.update(id, payload);
    setEditingId(null);
    loadData();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Templates Email</h1>

      <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold mb-4 text-secondary">Nouveau template</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom du template"
            className="rounded-lg border border-primary p-2 text-foreground"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Sujet de l'email"
            className="rounded-lg border border-primary p-2 text-foreground"
            value={createForm.subject}
            onChange={(e) =>
              setCreateForm({ ...createForm, subject: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Contenu de l'email"
            className="rounded-lg border border-primary p-2 text-foreground min-h-[100px]"
            value={createForm.body}
            onChange={(e) =>
              setCreateForm({ ...createForm, body: e.target.value })
            }
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-accent text-white px-6 py-2 rounded-lg font-bold hover:opacity-90"
            >
              Créer
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-secondary p-5 rounded-xl border-l-4 border-l-accent shadow-sm flex flex-col justify-between"
          >
            {editingId === t.id ? (
              <div className="flex flex-col gap-2">
                <input
                  className="border border-primary rounded p-1 font-bold"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  className="border border-primary rounded p-1"
                  value={editForm.subject || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, subject: e.target.value })
                  }
                />
                <textarea
                  className="border border-primary rounded p-1 min-h-[100px]"
                  value={editForm.body || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, body: e.target.value })
                  }
                />
                <div className="flex justify-end space-x-4 pt-3 mt-2">
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="text-green-600 hover:underline font-bold text-sm"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-secondary hover:underline font-bold text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-primary">
                    {t.name}
                  </h3>
                  <p className="text-sm font-semibold text-secondary mb-2">
                    {t.subject}
                  </p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {t.body}
                  </p>
                </div>
                <div className="flex justify-end space-x-4 border-t border-gray-100 pt-3 mt-4">
                  <button
                    onClick={() => startEdit(t)}
                    className="text-accent hover:underline font-bold text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-danger hover:underline font-bold text-sm"
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
