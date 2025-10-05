// src/components/SchemaPage/ImportSchema.tsx
import React, { useState } from "react";
import "./../CreateModal.css";
import type { Schema } from "../../../types/schema";
import Button from "../../Button";

interface ImportSchemaProps {
  onImport: (schema: Schema) => void;
  onCancel: () => void;
  existingSchemas?: Schema[];
}

export default function ImportSchema({ onImport, onCancel, existingSchemas = [] }: ImportSchemaProps) {
  const [importedJSON, setImportedJSON] = useState("");

  // Get all schemas from localStorage + existingSchemas
  const getAllSchemas = (): Schema[] => {
    const stored = localStorage.getItem("schemas");
    const storedSchemas: Schema[] = stored ? JSON.parse(stored) : [];
    return [...existingSchemas, ...storedSchemas];
  };

  // Find next free numeric ID
  const getNextId = (): string => {
    const allSchemas = getAllSchemas();
    const existingIds = allSchemas.map(s => Number(s.id)).filter(n => !isNaN(n));

    let nextId = 1;
    while (existingIds.includes(nextId)) nextId++;
    return String(nextId);
  };

  const handleImportJSON = () => {
    try {
      const parsed: Schema = JSON.parse(importedJSON);

      if (!parsed.name || !parsed.fields) {
        alert("Invalid schema JSON. Must have name and fields array.");
        return;
      }

      // ✅ Check if name already exists in localStorage or existingSchemas
      const allSchemas = getAllSchemas();
      if (allSchemas.some((s) => s.name.toLowerCase() === parsed.name.toLowerCase())) {
        alert(`A schema with the name "${parsed.name}" already exists.`);
        return;
      }

      // Validate that all fields are of allowed types
      const allowedTypes = ["text", "number", "checkbox", "select", "date"];
      const invalidField = parsed.fields.find(f => !allowedTypes.includes(f.type));
      if (invalidField) {
        alert(`Invalid field type: "${invalidField.type}". Allowed types are: ${allowedTypes.join(", ")}`);
        return;
      }

      // Assign ID
      parsed.id = parsed.id && !allSchemas.some((s) => s.id === parsed.id)
        ? parsed.id
        : getNextId();

      onImport(parsed);
    } catch (e: any) {
      alert("Invalid JSON: " + e.message);
    }
  };

  return (
    <>
      <h2>Import Schema JSON</h2>
      <p style={{ marginBottom: "0.5rem", fontStyle: "italic", color: "#555" }}>
        Note: Schemas only support fields of type <strong>text, number, checkbox, select, date</strong>.
      </p>
      <textarea
        value={importedJSON}
        onChange={(e) => setImportedJSON(e.target.value)}
        placeholder={`Paste your JSON schema here. Example:\n{\n  "name": "MySchema",\n  "fields": [{"name":"Field1","type":"text"}]\n}`}
        style={{ width: "100%", height: "200px", marginBottom: "1rem" }}
      />
      <div className="modal-actions">
        <Button variant="normal" onClick={handleImportJSON}>
          Import
        </Button>
        <Button variant="gray" onClick={onCancel}>
          Back
        </Button>
      </div>
    </>
  );
}
