// src/hooks/SchemaPage/useSchemas.ts
import { useState, useEffect } from "react";
import { Schema } from "../../types/schema";  // <-- import type

export function useSchemas() {
  const [schemas, setSchemas] = useState<Schema[]>(() => {
    const stored = localStorage.getItem("schemas");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("schemas", JSON.stringify(schemas));
  }, [schemas]);

  const addSchema = (newSchema: Schema) =>
    setSchemas((prev) => [...prev, { ...newSchema, data: [] }]);

  const updateSchema = (id: string, updatedSchema: Schema) =>
    setSchemas((prev) =>
      prev.map((s) =>
        s.id === id ? { ...updatedSchema, id, data: s.data || [] } : s
      )
    );

  const deleteSchema = (id: string) => {
    const schemaToDelete = schemas.find((s) => s.id === id);
    if (!schemaToDelete) return;

    const confirmDelete = window.confirm(
      `Deleting schema "${schemaToDelete.name}" will remove all its fields and all associated data. Continue?`
    );
    if (!confirmDelete) return;

    setSchemas((prev) => prev.filter((s) => s.id !== id));
  };

  const saveSchemaData = (id: string, data: any[]) => {
    setSchemas((prev) => prev.map((s) => (s.id === id ? { ...s, data } : s)));
  };

  return { schemas, addSchema, updateSchema, deleteSchema, saveSchemaData };
}
