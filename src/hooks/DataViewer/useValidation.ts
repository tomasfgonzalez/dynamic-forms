// src/hooks/DataViewer/useValidation.ts
import type { Schema, SchemaField, Row } from "../../types/schema";

export function useValidation(schema: Schema | null) {
  const getValidationMessage = (value: any, field: SchemaField): string => {
    if (field.type === "checkbox") return "";

    if (value === "" || value === null || value === undefined) return "Required";

    if (!field.range) return "";

    const { min, max } = field.range;

    if (field.type === "text") {
      const length = String(value).length;
      if (min !== undefined && min !== "" && length < Number(min)) return `Min chars: ${min}`;
      if (max !== undefined && max !== "" && length > Number(max)) return `Max chars: ${max}`;
      return "";
    }

    if (field.type === "number") {
      const num = Number(value);
      if (isNaN(num)) return "Must be a number";
      if (min !== undefined && min !== "" && num < Number(min)) return `Min: ${min}`;
      if (max !== undefined && max !== "" && num > Number(max)) return `Max: ${max}`;
      return "";
    }

    if (field.type === "date") {
      const dateValue = new Date(value);
      if (min && dateValue < new Date(min)) return `Min date: ${min}`;
      if (max && dateValue > new Date(max)) return `Max date: ${max}`;
      return "";
    }

    return "";
  };

  const validateRow = (row: Row, visibleFields?: SchemaField[]): Record<string, string> => {
    const errors: Record<string, string> = {};
    const fields = visibleFields ?? schema?.fields ?? [];
    fields.forEach((f) => {
      const msg = getValidationMessage(row[f.name], f);
      if (msg) errors[f.name] = msg;
    });
    return errors;
  };

  const validateAllRows = (rows: Row[], visibleFields?: SchemaField[]) => {
    return rows.map((row) => validateRow(row, visibleFields));
  };

  const hasAnyErrors = (rows: Row[], visibleFields?: SchemaField[]) => {
    return validateAllRows(rows, visibleFields).some(
      (rowErrors) => Object.keys(rowErrors).length > 0
    );
  };

  return { validateRow, validateAllRows, hasAnyErrors };
}
