import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFormPageData, { Schema } from "../DataViewer/useFormPageData";

export function useSelectedSchema() {
  const { schemaName } = useParams();
  const { schemas, selectedSchema, setSelectedSchemaId } = useFormPageData();
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
