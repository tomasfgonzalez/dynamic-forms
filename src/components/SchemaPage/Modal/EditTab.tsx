// src/components/SchemaPage/CreateFromScratch.tsx
import React from "react";
import type { Schema, SchemaField } from "../../../types/schema";
import { useSchemaFields } from "../../../hooks/SchemaPage/useManageFields";
import { useSchemaName } from "../../../hooks/SchemaPage/useSchemaName";
import "../CreateModal.css";
import Button from "../../Button";

interface Props {
  editingSchema: Schema | null;
  existingSchemas: Schema[];
  onSave: (schema: Schema) => void;
  onCancel: () => void;
}

export default function CreateFromScratch({
  editingSchema,
  existingSchemas,
  onSave,
  onCancel,
}: Props) {
  const [schemaName, setSchemaName] = useSchemaName(editingSchema);
  const { fields, addField, updateField, removeField } = useSchemaFields(editingSchema);

  const fieldTypes: SchemaField["type"][] = ["text", "number", "checkbox", "date", "select"];

  const handleSave = () => {
    if (!schemaName.trim()) return alert("Schema must have a name");
    if (fields.length === 0) return alert("Schema must have at least one field");
    if (fields.some((f) => f.name.trim() === "")) return alert("All fields must have a name");
    if (
      fields.some(
        (f) =>
          f.type === "select" &&
          (!f.options || f.options.some((o) => o.trim() === ""))
      )
    ) {
      return alert("All select fields must have at least one non-empty option");
    }
    if (
      existingSchemas.some(
        (s) =>
          s.name.toLowerCase() === schemaName.toLowerCase() &&
          s.id !== (editingSchema?.id || "")
      )
    ) {
      return alert("A schema with this name already exists");
    }

    const mappedFields: SchemaField[] = fields.map((f) => {
      const field: SchemaField = { name: f.name, type: f.type };

      // Apply range for text, number, or date
      if (f.type === "text" || f.type === "number" || f.type === "date") {
        const min = f.range?.min ?? "";
        const max = f.range?.max ?? "";
        if (!(min === "" && max === "")) {
          field.range = { min, max };
        }
      }

      if (f.type === "select") {
        field.options = f.options ?? [""];
      }
      return field;
    });

    onSave({
      id: editingSchema ? editingSchema.id : Date.now().toString(),
      name: schemaName,
      fields: mappedFields,
      data: editingSchema?.data || [],
    });
  };

  const handleChangeFieldName = (index: number, newName: string) => {
    const oldName = fields[index].name;
    updateField(index, "name", newName);

    if (editingSchema?.data && oldName && newName && oldName !== newName) {
      const updatedData = editingSchema.data.map((row) => {
        if (Object.prototype.hasOwnProperty.call(row, oldName)) {
          const newRow = { ...row };
          newRow[newName] = newRow[oldName];
          delete newRow[oldName];
          return newRow;
        }
        return row;
      });
      editingSchema.data = updatedData;
    }
  };

  const handleRemoveField = (index: number) => {
    const fieldName = fields[index]?.name;
    const fieldHasData = editingSchema?.data?.length && fieldName;

    if (fieldHasData) {
      const confirmDelete = window.confirm(
        `This field ("${fieldName}") has existing table data. Removing it will delete all its data. Continue?`
      );
      if (!confirmDelete) return;

      if (editingSchema?.data) {
        const updatedData = editingSchema.data.map((row) => {
          const newRow = { ...row };
          delete newRow[fieldName];
          return newRow;
        });
        editingSchema.data = updatedData;
      }
    }

    removeField(index);
  };

  const handleChangeFieldType = (index: number, newType: SchemaField["type"]) => {
    const fieldHasData = editingSchema?.data?.length && fields[index]?.name;
    if (
      fieldHasData &&
      !window.confirm("Changing this type will affect existing data. Continue?")
    )
      return;

    const field = fields[index];
    updateField(index, "type", newType);

    if (newType === "select") updateField(index, "options", field.options || [""]);
    else updateField(index, "options", undefined);

    if (newType === "number" || newType === "date" || newType === "text") {
      updateField(index, "range", { min: "", max: "" });
    } else {
      updateField(index, "range", undefined);
    }
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
          style={{
            borderColor: schemaName.trim() === "" ? "rgba(255,0,0,0.7)" : undefined,
          }}
        />
      </div>

      <div className="fields-container">
        {fields.map((field, index) => (
          <div key={index} className="field-row">
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => handleChangeFieldName(index, e.target.value)}
              style={{
                borderColor: field.name.trim() === "" ? "rgba(255,0,0,0.7)" : undefined,
              }}
            />

            <select
              value={field.type}
              onChange={(e) =>
                handleChangeFieldType(index, e.target.value as SchemaField["type"])
              }
            >
              {fieldTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {(field.type === "number" || field.type === "date" || field.type === "text") && (
              <div className="field-range">
                <input
                  type={field.type === "text" ? "number" : field.type}
                  placeholder={field.type === "text" ? "Min length" : "Min value"}
                  value={field.range?.min ?? ""}
                  min={field.type === "text" ? 0 : undefined} // Only positive for text
                  onChange={(e) => {
                    let val: any = e.target.value;
                    if (field.type === "text") val = val === "" ? "" : Math.max(0, Number(val));
                    updateField(index, "range", val, "min");
                  }}
                />
                <input
                  type={field.type === "text" ? "number" : field.type}
                  placeholder={field.type === "text" ? "Max length" : "Max value"}
                  value={field.range?.max ?? ""}
                  min={field.type === "text" ? 0 : undefined} // Only positive for text
                  onChange={(e) => {
                    let val: any = e.target.value;
                    if (field.type === "text") val = val === "" ? "" : Math.max(0, Number(val));
                    updateField(index, "range", val, "max");
                  }}
                />
              </div>
            )}

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
                    <Button
                      variant="gray"
                      onClick={() => {
                        if (window.confirm("Remove this option?")) {
                          const newOptions = field.options!.filter((_, i) => i !== optIndex);
                          updateField(index, "options", newOptions);
                        }
                      }}
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Button
                  variant="normal"
                  onClick={() => {
                    const newOptions = field.options ? [...field.options, ""] : [""];
                    updateField(index, "options", newOptions);
                  }}
                >
                  + Add Option
                </Button>
              </div>
            )}

            <Button variant="remove" onClick={() => handleRemoveField(index)}>
              Remove
            </Button>
          </div>
        ))}

        <Button variant="normal" onClick={() => addField("text")}>
          + Add Field
        </Button>
      </div>

      <div className="modal-actions">
        <Button variant="normal" onClick={handleSave}>
          Save
        </Button>
        <Button variant="gray" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
}
