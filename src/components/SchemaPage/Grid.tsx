import React from "react";
import { useNavigate } from "react-router-dom";

// Modals & cards
import CreateSchemaModal from "./CreateModal";
import SchemaCard from "./Cards/SchemaCard";
import CreateSchemaCard from "./Cards/CreateSchemaCard";

// Hooks
import { useSchemas } from "../../hooks/SchemaPage/useSchemas";
import { useSchemaModal } from "../../hooks/SchemaPage/Modal/useModalState";
import { useFadeIn } from "../../hooks/useFadeIn";

// Types
import type { Schema } from "../../types/schema";

// Styles
import "./Grid.css";

export default function SchemasGrid() {
  const { schemas, addSchema, updateSchema, deleteSchema } = useSchemas();
  const { isModalOpen, editingSchema, openForCreate, openForEdit, closeModal } =
    useSchemaModal();
  const fadeIn = useFadeIn();
  const navigate = useNavigate();

  // Navigate to form page
  const handleUse = (schema: Schema) => {
    navigate(`/form/${encodeURIComponent(String(schema.name))}`);
  };

  // Save schema from modal
  const handleSave = (schemaData: { id?: string | number; name: string; fields: any[] }) => {
    const newSchema: Schema = {
      id: schemaData.id ? String(schemaData.id) : Date.now().toString(),
      name: schemaData.name,
      fields: schemaData.fields.map((f) => ({
        name: f.name,
        type: f.type,
        options: f.options,
        range: f.range,
      })),
      data: editingSchema?.data || [],
    };

    if (editingSchema) updateSchema(String(editingSchema.id), newSchema);
    else addSchema(newSchema);

    closeModal();
  };

  return (
    <>
      <div className={`grid-container ${fadeIn ? "fade-in" : ""}`}>
        <CreateSchemaCard fadeIn={fadeIn} onClick={openForCreate} />

        {schemas.map((schema, index) => (
          <SchemaCard
            key={schema.id}
            schema={schema}
            fadeIn={fadeIn}
            delay={(index + 1) * 150}
            onUse={() => handleUse(schema)}
            onEdit={() => openForEdit(schema)}
            onDelete={() => deleteSchema(String(schema.id))}
          />
        ))}
      </div>

      <CreateSchemaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingSchema={editingSchema}
        existingSchemas={schemas}
      />
    </>
  );
}
