import { useState, useEffect, useCallback } from "react";

export function useCrud<T extends { id: string | number }, CreateDTO>(
  service: any,
  initialCreateState: CreateDTO,
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editForm, setEditForm] = useState<Partial<T>>({});
  const [createForm, setCreateForm] = useState<CreateDTO>(initialCreateState);

  const loadData = useCallback(async () => {
    try {
      const res = await service.getAll();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    }
  }, [service]);

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent, customPayload?: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await service.create(customPayload || createForm);
      setSuccess("Création réussie");
      setCreateForm(initialCreateState);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de création");
    }
  };

  const handleDelete = async (id: string | number) => {
    setError("");
    setSuccess("");
    try {
      await service.delete(id);
      setSuccess("Suppression réussie");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    }
  };

  const startEdit = (item: T) => {
    setError("");
    setSuccess("");
    setEditingId(item.id);
    setEditForm(item);
  };

  const saveEdit = async (
    id: string | number,
    payloadModifier?: (form: Partial<T>) => any,
  ) => {
    setError("");
    setSuccess("");
    try {
      const payload = payloadModifier
        ? payloadModifier(editForm)
        : { ...editForm };
      await service.update(id, payload);
      setSuccess("Mise à jour réussie");
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de modification");
    }
  };

  const handleUpdateField = async (
    id: string | number,
    field: string,
    value: any,
  ) => {
    setError("");
    setSuccess("");
    try {
      await service.update(id, { [field]: value });
      setSuccess("Mise à jour réussie");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de modification");
    }
  };

  return {
    data,
    error,
    success,
    editingId,
    editForm,
    createForm,
    setError,
    setSuccess,
    setEditingId,
    setEditForm,
    setCreateForm,
    handleCreate,
    handleDelete,
    startEdit,
    saveEdit,
    handleUpdateField,
    loadData,
  };
}
