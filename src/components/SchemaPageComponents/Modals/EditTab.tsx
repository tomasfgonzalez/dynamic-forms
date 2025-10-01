import React from "react";
import { Schema, SchemaField } from "../../../hooks/useSchemas";
import { useSchemaFields } from "../../../hooks/useSchemaFields";
import { useSchemaName } from "../../../hooks/useSchemaName";
import "../CreateSchemaModal.css";

interface Props {
  editingSchema: Schema | null;
  existingSchemas: Schema[];
  onSave: (schema: Schema) => void;
  onCancel: () => void;
}

export default function CreateFromScratch({ editingSchema, existingSchemas, onSave, onCancel }: Props) {
  const [schemaName, setSchemaName] = useSchemaName(editingSchema);
  const { fields, addField, updateField, removeField } = useSchemaFields(editingSchema);

  const fieldTypes: SchemaField["type"][] = ["text", "number", "checkbox", "date", "select"];

  const handleSave = () => {
    if (!schemaName.trim()) {
      alert("Schema must have a name");
      return;
    }

    if (fields.length === 0) {
      alert("Schema must have at least one field");
      return;
    }

    const emptyFields = fields.some(f => f.name.trim() === "");
    if (emptyFields) {
      alert("All fields must have a name before saving.");
      return;
    }

    const invalidSelect = fields.some(
      (f) => f.type === "select" && (!f.options || f.options.some(opt => opt.trim() === ""))
    );
    if (invalidSelect) {
      alert("All select fields must have at least one non-empty option.");
      return;
    }

    const nameExists = existingSchemas.some(
      (s) => s.name.toLowerCase() === schemaName.toLowerCase() && s.id !== (editingSchema?.id || "")
    );
    if (nameExists) {
      alert("A schema with this name already exists. Choose another name.");
      return;
    }

    onSave({
      id: editingSchema ? editingSchema.id : Date.now().toString(),
      name: schemaName,
      fields,
    });
  };

  const handleRemoveField = (index: number) => {
    const fieldHasData = editingSchema?.data?.length && fields[index]?.name;
    if (fieldHasData) {
      const confirmDelete = window.confirm(
        `This field has existing table data. Removing it will delete all its data. Continue?`
      );
      if (!confirmDelete) return;
    }
    removeField(index);
  };

  const handleChangeFieldType = (index: number, newType: SchemaField["type"]) => {
    const fieldHasData = editingSchema?.data?.length && fields[index]?.name;
    if (fieldHasData) {
      const confirmChange = window.confirm(
        `Changing the type of this field will affect existing table data. Continue?`
      );
      if (!confirmChange) return;
    }

    const field = fields[index];
    updateField(index, "type", newType);

    if (newType === "select") updateField(index, "options", field.options || [""]);
    else updateField(index, "options", undefined);
  };

  return (
    <>
      <h2>{editingSchema ? "Edit Schema" : "Create From Scratch"}</h2>

      <div className="schema-name-container">
        <label>Name of the schema:</label>
        <input
          type="text"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
          placeholder="Enter schema name..."
          style={{ borderColor: schemaName.trim() === "" ? "rgba(255,0,0,0.7)" : undefined }}
        />
      </div>

      <div className="fields-container">
        {fields.map((field, index) => (
          <div key={index} className="field-row">
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => updateField(index, "name", e.target.value)}
              style={{ borderColor: field.name.trim() === "" ? "rgba(255,0,0,0.7)" : undefined }}
            />

            <select
              value={field.type}
              onChange={(e) => handleChangeFieldType(index, e.target.value as SchemaField["type"])}
            >
              {fieldTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {field.type === "number" || field.type === "date" ? (
              <div className="field-range">
                <input
                  type={field.type}
                  placeholder="Min"
                  value={field.range?.min || ""}
                  onChange={(e) => updateField(index, "range", e.target.value, "min")}
                />
                <input
                  type={field.type}
                  placeholder="Max"
                  value={field.range?.max || ""}
                  onChange={(e) => updateField(index, "range", e.target.value, "max")}
                />
              </div>
            ) : null}

            {field.type === "select" && (
              <div className="select-options">
                {field.options?.map((opt, optIndex) => (
                  <div key={optIndex} className="option-row">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...field.options!];
                        newOptions[optIndex] = e.target.value;
                        updateField(index, "options", newOptions);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const confirmDelete = window.confirm("Are you sure you want to remove this option?");
                        if (confirmDelete) {
                          const newOptions = field.options!.filter((_, i) => i !== optIndex);
                          updateField(index, "options", newOptions);
                        }
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newOptions = field.options ? [...field.options, ""] : [""];
                    updateField(index, "options", newOptions);
                  }}
                >
                  + Add Option
                </button>
              </div>
            )}

            <button type="button" onClick={() => handleRemoveField(index)}>
              Remove
            </button>
          </div>
        ))}

        <button className="add-field-button" onClick={() => addField("text")}>
          + Add Field
        </button>
      </div>

      <div className="modal-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </>
  );
}
