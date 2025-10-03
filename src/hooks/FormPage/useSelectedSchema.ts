// src/hooks/FormPage/useSelectedSchema.ts
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Schema } from "../../types/schema";
import { useDataViewerPage } from "../DataViewer/useDataViewerPage";

export function useSelectedSchema() {
  const { schemaName } = useParams<{ schemaName: string }>();
  const { schemas, selectedSchema, setSelectedSchemaId } = useDataViewerPage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schemaName || schemas.length === 0) return;

    const decodedName = decodeURIComponent(schemaName);
    const schema = schemas.find((s) => s.name === decodedName);

    if (schema) {
      setSelectedSchemaId(schema.id);
    } else {
      alert("Schema not found!");
    }

    setLoading(false);
  }, [schemaName, schemas, setSelectedSchemaId]);

  return { selectedSchema, loading };
}
