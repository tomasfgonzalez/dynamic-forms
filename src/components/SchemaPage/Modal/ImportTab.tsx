import React, { useState } from "react";
import "./../CreateModal.css";
import type { Schema } from "../../../types/schema";
import Button from "../../Button"; // reusable button

interface ImportSchemaProps {
  onImport: (schema: Schema) => void;
  onCancel: () => void;
  existingSchemas?: Schema[];
}

export default function ImportSchema({ onImport, onCancel, existingSchemas = [] }: ImportSchemaProps) {
  const [importedJSON, setImportedJSON] = useState("");

  // Find next free numeric ID based on existingSchemas + localStorage
  const getNextId = (): string => {
    const stored = localStorage.getItem("schemas");
    const storedSchemas: Schema[] = stored ? JSON.parse(stored) : [];
    const allSchemas = [...existingSchemas, ...storedSchemas];
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

      parsed.id = parsed.id && !existingSchemas.some((s) => s.id === parsed.id)
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
      <textarea
        value={importedJSON}
        onChange={(e) => setImportedJSON(e.target.value)}
        placeholder={`Paste your JSON schema here. Example:\n{\n  "name": "MySchema",\n  "fields": [{"name":"Field1","type":"text"}]\n}`}
        style={{ width: "100%", height: "200px", marginBottom: "1rem" }}
      />
      <div className="modal-actions">
        {/* Primary button for Import */}
        <Button variant="normal" onClick={handleImportJSON}>
          Import
        </Button>
        {/* Gray button for Back */}
        <Button variant="gray" onClick={onCancel}>
          Back
        </Button>
      </div>
    </>
  );
}
