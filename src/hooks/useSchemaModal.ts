import { useState } from "react";
import type { Schema } from "./useSchemas";

export function useSchemaModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchema, setEditingSchema] = useState<Schema | null>(null);

  const openForCreate = () => {
    setEditingSchema(null);
    setIsModalOpen(true);
  };

  const openForEdit = (schema: Schema) => {
    setEditingSchema(schema);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingSchema(null);
    setIsModalOpen(false);
  };

  return { isModalOpen, editingSchema, openForCreate, openForEdit, closeModal };
}
