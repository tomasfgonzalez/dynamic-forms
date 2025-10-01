import { useState, useEffect } from "react";

import type { Schema } from "./useSchemas";

export function useSchemaName(editingSchema: Schema | null): [string, (name: string) => void] {
  const [schemaName, setSchemaName] = useState("");

  useEffect(() => {
    setSchemaName(editingSchema ? editingSchema.name : "");
  }, [editingSchema]);

  return [schemaName, setSchemaName];
}
