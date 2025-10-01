// src/components/schemasPageComponents/SchemasGrid.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CreateSchemaModal from "./CreateSchemaModal";
import { useSchemas, Schema, SchemaField } from "../../hooks/useSchemas";
import { useSchemaModal } from "../../hooks/useSchemaModal";
import { useFadeIn } from "../../hooks/useFadeIn";
import "./SchemasGrid.css";

export default function SchemasGrid() {
  const { schemas, addSchema, updateSchema, deleteSchema } = useSchemas();
  const { isModalOpen, editingSchema, openForCreate, openForEdit, closeModal } =
    useSchemaModal();
  const fadeIn = useFadeIn();
  const navigate = useNavigate();

  const handleUse = (schema: Schema) => {
    navigate(`/form/${encodeURIComponent(schema.name)}`);
  };

  const handleSave = (schemaData: {
    id?: string | number;
    name: string;
    fields: any[];
  }) => {
    const newSchema: Schema = {
      id: schemaData.id ? String(schemaData.id) : Date.now().toString(),
      name: schemaData.name,
      fields: schemaData.fields.map((f) => ({
        name: f.name,
        type: f.type as "text" | "number" | "checkbox" | "date" | "select",
        options: f.options,
        range: f.range,
      })) as SchemaField[],
      data: editingSchema?.data || [],
    };

    if (editingSchema) {
      updateSchema(editingSchema.id, newSchema);
    } else {
      addSchema(newSchema);
    }
    closeModal();
  };

  return (
    <>
      {/* ==== Grid of cards ==== */}
      <div className={`grid-container ${fadeIn ? "fade-in" : ""}`}>
        {/* Create new schema card */}
        <div
          className={`create-schema-card ${fadeIn ? "fade-in-card show" : ""}`}
          style={{ transitionDelay: `100ms` }}
          onClick={openForCreate}
        >
          +
        </div>

        {/* Existing schemas */}
        {schemas.map((schema, index) => (
          <div
            key={schema.id}
            className={`schema-card ${fadeIn ? "fade-in-card show" : ""}`}
            style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            onClick={() => handleUse(schema)}
          >
            <button
              className="delete-cross"
              onClick={(e) => {
                e.stopPropagation();
                deleteSchema(schema.id);
              }}
            >
              ×
            </button>

            <h3>{schema.name}</h3>
            <div className="schema-fields-wrapper">
              <div className="schema-fields">
                {schema.fields.length === 0 && <p>No fields</p>}
                {schema.fields.slice(0, 9).map((f, i) => (
                  <div
                    key={`${schema.id}-field-${i}`}
                    className="schema-field"
                    style={{ opacity: Math.max(1 - i * 0.1, 0) }}
                  >
                    {f.name} ({f.type})
                  </div>
                ))}
              </div>
            </div>

            <div className="schema-card-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openForEdit(schema);
                }}
              >
                Edit Fields
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ==== Modal (reuses same card styles) ==== */}
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
