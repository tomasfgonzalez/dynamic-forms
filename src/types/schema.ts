// src/types/schema.ts
export type FieldType = "text" | "number" | "checkbox" | "date" | "select";

export interface SchemaField {
  name: string;
  type: FieldType;
  options?: string[];
  range?: { min: string | number; max: string | number };
}

export interface FieldWithRange extends SchemaField {
  type: FieldType;
  options?: string[];
  range?: { min: string | number; max: string | number };
}

export interface Row {
  [key: string]: string | number | boolean;
}

export interface Schema {
  id: string | number;
  name: string;
  fields: SchemaField[];
  data?: Row[];
}
