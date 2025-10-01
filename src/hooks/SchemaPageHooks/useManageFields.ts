// src/hooks/useSchemaFields.ts
import { useState, useEffect } from "react";
import type { Schema, SchemaField } from "./useSchemas";

export type FieldType = "text" | "number" | "checkbox" | "date" | "select";

export interface FieldWithRange extends SchemaField {
  type: FieldType;
  options?: string[];
  range?: { min: string | number; max: string | number };
}

export function useSchemaFields(editingSchema: Schema | null) {
  const [fields, setFields] = useState<FieldWithRange[]>([]);
  const [touched, setTouched] = useState<boolean[]>([]);

  useEffect(() => {
    if (editingSchema) {
      setFields(
        editingSchema.fields.length
          ? editingSchema.fields.map((f) => ({
              ...f,
              type: f.type as FieldType,
              range: f.range || { min: "", max: "" },
              options: f.options || [],
            }))
          : [{ name: "", type: "text", range: { min: "", max: "" } }]
      );
    } else {
      setFields([{ name: "", type: "text", range: { min: "", max: "" } }]);
    }
    setTouched([]);
  }, [editingSchema]);

  const addField = (type: FieldType = "text") => {
    setFields([...fields, { name: "", type, range: { min: "", max: "" } }]);
    setTouched([...touched, false]);
  };

  const updateField = (
    index: number,
    key: keyof FieldWithRange | "range",
    value: any,
    rangeKey?: "min" | "max"
  ) => {
    const newFields = [...fields];
    if (key === "range" && rangeKey) {
      newFields[index].range = newFields[index].range || { min: "", max: "" };
      newFields[index].range![rangeKey] = value; // non-null assertion
    } else {
      (newFields[index] as any)[key] = value;
    }
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    setTouched(touched.filter((_, i) => i !== index));
  };

  return { fields, touched, addField, updateField, removeField, setFields };
}
