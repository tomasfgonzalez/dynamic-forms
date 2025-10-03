import { useState, useEffect } from "react";
import type { Schema } from "../../types/schema";

export function useSchemaSelection(schemas: Schema[]) {
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | number | null>(null);
  const selectedSchema = schemas.find((s) => s.id === selectedSchemaId) || null;

  useEffect(() => {
    if (!selectedSchemaId && schemas.length > 0) {
      const lastOpenedId = localStorage.getItem("lastSchemaId");
      const schemaToSelect =
        schemas.find((s) => s.id === lastOpenedId) || schemas[schemas.length - 1];
      setSelectedSchemaId(schemaToSelect.id);
    }
  }, [schemas, selectedSchemaId]);

  useEffect(() => {
    if (selectedSchemaId) localStorage.setItem("lastSchemaId", selectedSchemaId.toString());
  }, [selectedSchemaId]);

  return { selectedSchemaId, setSelectedSchemaId, selectedSchema };
}
