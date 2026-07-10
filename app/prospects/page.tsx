"use client";

import { useEffect, useState, useCallback } from "react";
import { prospectService } from "../services/prospectService";
import { statusService } from "../services/statusService";
import { countryService } from "../services/countryService";
import { ProspectExtended, Status, Country } from "../types";
import Toast from "../components/Toast";

const formInputs = [
  { name: "first_name", type: "text", placeholder: "Prénom", required: true },
  { name: "last_name", type: "text", placeholder: "Nom", required: true },
  { name: "email", type: "email", placeholder: "Email", required: true },
  { name: "phone", type: "tel", placeholder: "Téléphone", required: false },
];

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<ProspectExtended[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [sortOption, setSortOption] = useState("alpha_asc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProspectExtended>>({});
  const [createForm, setCreateForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "Masculin",
    country_id: 1,
    status_id: 1,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [pData, sData, cData] = await Promise.all([
        prospectService.getAll(),
        statusService.getAll(),
        countryService.getAll(),
      ]);
      setProspects(pData);
      setStatuses(sData);
      setCountries(cData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors du chargement des données");
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: name.endsWith("_id") ? Number(value) : value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const { country_id, ...rest } = createForm;
      await prospectService.create({ ...rest, country: String(country_id) });
      setSuccess("Prospect créé avec succès");
      setCreateForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "Masculin",
        country_id: 1,
        status_id: 1,
      });
      loadData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la création");
      }
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    setSuccess("");
    try {
      await prospectService.delete(id);
      setSuccess("Prospect supprimé");
      loadData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la suppresion");
      }
    }
  };

  const handleUpdate = async (
    id: string,
    field: string,
    value: string | number,
  ) => {
    setError("");
    setSuccess("");
    try {
      await prospectService.update(id, { [field]: value });
      setSuccess("Prospect mis à jour");
      loadData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la mise à jour");
      }
    }
  };

  const startEdit = (p: ProspectExtended) => {
    setError("");
    setSuccess("");
    setEditingId(p.id);
    setEditForm(p);
  };

  const saveEdit = async (id: string) => {
    setError("");
    setSuccess("");
    try {
      await prospectService.update(id, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone: editForm.phone,
      });
      setSuccess("Prospect mis à jour avec succès");
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

  const sortedProspects = [...prospects].sort((a, b) => {
    switch (sortOption) {
      case "alpha_asc":
        return a.last_name.localeCompare(b.last_name);
      case "alpha_desc":
        return b.last_name.localeCompare(a.last_name);
      case "date_desc":
        return (
          new Date(b.last_action_date || 0).getTime() -
          new Date(a.last_action_date || 0).getTime()
        );
      case "date_asc":
        return (
          new Date(a.last_action_date || 0).getTime() -
          new Date(b.last_action_date || 0).getTime()
        );
      case "status":
        return (a.status_name || "").localeCompare(b.status_name || "");
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      <Toast message={error} type="error" onClose={() => setError("")} />
      <Toast message={success} type="success" onClose={() => setSuccess("")} />

      <h1 className="text-3xl font-bold text-primary dark:text-white">
        Prospects
      </h1>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Ajouter un prospect
          </h2>
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
            Nouveau
          </span>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {formInputs.map((input) => (
            <div key={input.name}>
              <label className="label-text">{input.placeholder}</label>
              <input
                name={input.name}
                type={input.type}
                className="input-field"
                value={createForm[input.name as keyof typeof createForm]}
                onChange={handleCreateChange}
                required={input.required}
              />
            </div>
          ))}

          <div>
            <label className="label-text">Pays</label>
            <select
              name="country_id"
              className="input-field"
              value={createForm.country_id}
              onChange={handleCreateChange}
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text">Sexe</label>
            <select
              name="gender"
              className="input-field"
              value={createForm.gender}
              onChange={handleCreateChange}
            >
              <option value="Masculin">Homme</option>
              <option value="Féminin">Femme</option>
            </select>
          </div>

          <div>
            <label className="label-text">Statut</label>
            <select
              name="status_id"
              className="input-field"
              value={createForm.status_id}
              onChange={handleCreateChange}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4 flex justify-end mt-2">
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
              <th className="p-3 font-semibold">Nom</th>
              <th className="p-3 font-semibold">Contact</th>
              <th className="p-3 font-semibold">Pays</th>
              <th className="p-3 font-semibold">Statut</th>
              <th className="p-3 font-semibold">Dernière action</th>
              <th className="p-3 font-semibold text-right">
                <select
                  className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm font-normal cursor-pointer outline-none transition-colors"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="alpha_asc">
                    Trier par: Alphabétique (A-Z)
                  </option>
                  <option value="alpha_desc">
                    Trier par: Alphabétique (Z-A)
                  </option>
                  <option value="date_desc">Trier par: Action récente</option>
                  <option value="date_asc">Trier par: Action ancienne</option>
                  <option value="status">Trier par: Statut</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProspects.map((p) => (
              <tr
                key={p.id}
                className="group border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3">
                  {editingId === p.id ? (
                    <div className="flex gap-2">
                      <input
                        className="input-field py-1 px-2 w-24"
                        value={editForm.first_name || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            first_name: e.target.value,
                          })
                        }
                      />
                      <input
                        className="input-field py-1 px-2 w-24"
                        value={editForm.last_name || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <>
                      {p.first_name} {p.last_name}
                    </>
                  )}
                </td>
                <td className="p-3">
                  {editingId === p.id ? (
                    <div className="flex flex-col gap-1">
                      <input
                        className="input-field py-1 px-2"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                      <input
                        className="input-field py-1 px-2"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <>
                      {p.email}
                      <br />
                      <span className="text-xs text-slate-500">{p.phone}</span>
                    </>
                  )}
                </td>
                <td className="p-3">
                  <select
                    className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm cursor-pointer outline-none transition-colors"
                    value={p.country_id ?? ""}
                    onChange={(e) =>
                      handleUpdate(p.id, "country_id", Number(e.target.value))
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
                    className="bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary rounded px-2 py-1 text-sm cursor-pointer outline-none transition-colors"
                    value={p.status_id ?? ""}
                    onChange={(e) =>
                      handleUpdate(p.id, "status_id", Number(e.target.value))
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-sm">
                  {p.last_action_date
                    ? new Date(p.last_action_date).toLocaleDateString()
                    : "Jamais"}
                </td>
                <td className="p-3 text-right">
                  {editingId === p.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveEdit(p.id)}
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
                        onClick={async () => {
                          try {
                            const status = statuses.find(
                              (s) => s.id === p.status_id,
                            );
                            if (!status?.id) {
                              throw new Error("Aucun template lié à ce statut");
                            }

                            await prospectService.sendEmail(p.id, status.id);
                            setSuccess("Email envoyé");
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Erreur lors de l'envoi",
                            );
                          }
                        }}
                        className="btn btn-ghost text-blue-600 px-2 py-1 text-sm"
                      >
                        Envoyer Mail
                      </button>
                      <button
                        onClick={() => startEdit(p)}
                        className="btn btn-ghost text-accent px-2 py-1 text-sm"
                      >
                        Corriger
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-ghost text-danger px-2 py-1 text-sm"
                      >
                        Supprimer
                      </button>
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
