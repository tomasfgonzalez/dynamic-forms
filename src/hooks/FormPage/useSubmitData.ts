// src/hooks/FormPage/useSubmitData.ts
import { useState, useEffect } from "react";
import type { Schema, Row } from "../../types/schema";

export function useSubmitData() {
  const [schemasMap, setSchemasMap] = useState<Record<string, Schema>>({});

  // Load schemas from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("schemas");
    if (stored) {
      try {
        const parsed: Schema[] = JSON.parse(stored);
        const map: Record<string, Schema> = {};
        parsed.forEach((s) => (map[s.id] = s));
        setSchemasMap(map);
      } catch {
        setSchemasMap({});
      }
    }
  }, []);

  const persist = (map: Record<string, Schema>) => {
    setSchemasMap(map);
    const arr = Object.values(map);
    localStorage.setItem("schemas", JSON.stringify(arr));
  };

  const submitData = (row: Row, schema: Schema) => {
    const mapCopy = { ...schemasMap };

    const schemaCopy = mapCopy[schema.id] ? { ...mapCopy[schema.id] } : { ...schema, data: [] };
    if (!schemaCopy.data) schemaCopy.data = [];

    schemaCopy.data.push(row);
    mapCopy[schema.id] = schemaCopy;

    persist(mapCopy);
  };

  return { submitData, schemasMap };
}
