// src/hooks/useFormsPage.ts
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFormPageData from "./DataViewer/useFormPageData";

export function useFormsPage() {
  const { schemaName } = useParams();
  const { schemas, selectedSchema, setSelectedSchemaId, addRow, updateCell } = useFormPageData();

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // sync schema with URL
  useEffect(() => {
    if (!schemaName || schemas.length === 0) return;
    const decodedName = decodeURIComponent(schemaName);
    const schema = schemas.find((s) => s.name === decodedName);
    if (schema) setSelectedSchemaId(schema.id);
  }, [schemaName, schemas, setSelectedSchemaId]);

  // init form values when schema changes
  useEffect(() => {
    if (!selectedSchema) return;
    const initialValues: { [key: string]: any } = {};
    const initialErrors: { [key: string]: string } = {};
    selectedSchema.fields.forEach((f) => {
      if (f.type === "checkbox") initialValues[f.name] = false;
      else if (f.type === "select") initialValues[f.name] = f.options?.[0] || "";
      else initialValues[f.name] = "";
      initialErrors[f.name] = "";
    });
    setFormValues(initialValues);
    setValidationErrors(initialErrors);
  }, [selectedSchema]);

  const validateField = (field: any, value: any) => {
    if (!field) return "";
    if (field.type !== "checkbox" && (value === "" || value === null)) return "Required";
    if (field.type === "number") {
      const num = Number(value);
      if (isNaN(num)) return "Must be a number";
      if (field.range?.min !== undefined && num < field.range.min) return `Min: ${field.range.min}`;
      if (field.range?.max !== undefined && num > field.range.max) return `Max: ${field.range.max}`;
    }
    if (field.type === "date") {
      if (field.range?.min && value < field.range.min) return `Min: ${field.range.min}`;
      if (field.range?.max && value > field.range.max) return `Max: ${field.range.max}`;
    }
    return "";
  };

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    const field = selectedSchema?.fields.find((f) => f.name === name);
    const error = validateField(field, value);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = () => {
    if (!selectedSchema) return false;
    const newErrors: { [key: string]: string } = {};
    selectedSchema.fields.forEach((f) => {
      newErrors[f.name] = validateField(f, formValues[f.name]);
    });
    setValidationErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return false;

    addRow();
    const newRowIndex = selectedSchema.data?.length || 0;
    Object.entries(formValues).forEach(([k, v]) => updateCell(newRowIndex, k, v));
    return true;
  };

  return {
    schemas,
    selectedSchema,
    formValues,
    validationErrors,
    handleChange,
    handleSubmit,
  };
}
