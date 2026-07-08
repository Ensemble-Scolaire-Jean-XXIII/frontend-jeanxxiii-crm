"use client";

import { useEffect, useState, useCallback } from "react";
import { prospectService } from "../services/prospectService";
import { statusService } from "../services/statusService";
import { countryService } from "../services/countryService";
import { Prospect } from "../types";

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Prospect>>({});

  const [createForm, setCreateForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "Masculin",
    country_id: 1,
    status_id: 1,
  });

  const loadData = useCallback(async () => {
    const [pData, sData, cData] = await Promise.all([
      prospectService.getAll(),
      statusService.getAll(),
      countryService.getAll(),
    ]);
    setProspects(pData);
    setStatuses(sData);
    setCountries(cData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await prospectService.create(createForm);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await prospectService.delete(id);
    loadData();
  };

  const startEdit = (p: Prospect) => {
    setEditingId(p.id);
    setEditForm(p);
  };

  const saveEdit = async (id: string) => {
    const payload = { ...editForm };
    delete (payload as Record<string, unknown>).created_at;
    delete (payload as Record<string, unknown>).last_action_date;
    delete (payload as Record<string, unknown>).status_name;
    delete (payload as Record<string, unknown>).country_name;
    delete (payload as Record<string, unknown>).id;

    await prospectService.update(id, payload);
    setEditingId(null);
    loadData();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Prospects</h1>

      <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold mb-4 text-secondary">Ajouter un prospect</h2>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Prénom"
            className="rounded-lg border p-2"
            value={createForm.first_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, first_name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Nom"
            className="rounded-lg border p-2"
            value={createForm.last_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, last_name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="rounded-lg border p-2"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
            required
          />
          <input
            type="tel"
            placeholder="Téléphone"
            className="rounded-lg border p-2"
            value={createForm.phone}
            onChange={(e) =>
              setCreateForm({ ...createForm, phone: e.target.value })
            }
          />

          <select
            className="rounded-lg border p-2"
            value={createForm.country_id}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                country_id: Number(e.target.value),
              })
            }
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border p-2"
            value={createForm.gender}
            onChange={(e) =>
              setCreateForm({ ...createForm, gender: e.target.value })
            }
          >
            <option value="Masculin">Homme</option>
            <option value="Féminin">Femme</option>
          </select>

          <select
            className="rounded-lg border p-2"
            value={createForm.status_id}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                status_id: Number(e.target.value),
              })
            }
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded-lg font-bold hover:opacity-90"
          >
            Créer
          </button>
        </form>
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-secondary p-6 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-primary text-secondary">
              <th className="p-3">Nom</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Pays</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Dernière action</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((p) => (
              <tr key={p.id} className="border-b">
                {editingId === p.id ? (
                  <>
                    <td className="p-3 flex gap-2">
                      <input
                        className="border p-1 w-20"
                        value={editForm.first_name || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            first_name: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border p-1 w-20"
                        value={editForm.last_name || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="p-3">
                      <input
                        className="border p-1 w-full"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-3">
                      <select
                        className="border p-1"
                        value={editForm.country_id}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            country_id: Number(e.target.value),
                          })
                        }
                      >
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        className="border p-1"
                        value={editForm.status_id}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            status_id: Number(e.target.value),
                          })
                        }
                      >
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-sm text-gray-500">Auto</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => saveEdit(p.id)}
                        className="text-green-600 font-bold mr-2"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 font-bold"
                      >
                        Annuler
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">
                      {p.first_name} {p.last_name}
                    </td>
                    <td className="p-3">
                      {p.email}
                      <br />
                      <span className="text-xs text-gray-500">{p.phone}</span>
                    </td>
                    <td className="p-3">{p.country_name || "N/A"}</td>
                    <td className="p-3">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                        {p.status_name}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {p.last_action_date
                        ? new Date(p.last_action_date).toLocaleDateString()
                        : "Jamais"}
                    </td>
                    <td className="p-3 text-right space-x-4">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-accent font-bold"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-danger font-bold"
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
