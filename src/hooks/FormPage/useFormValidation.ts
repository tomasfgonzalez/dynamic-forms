import { useState, useEffect } from "react";
  import { SchemaField } from "../../types/schema";

export function useFormValidation(fields: SchemaField[], initialValues: { [key: string]: any }) {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>(initialValues);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Initialize empty validation errors and validate initial values
  useEffect(() => {
    const initialErrors: { [key: string]: string } = {};
    fields.forEach((f) => {
      initialErrors[f.name] = validateField(f, initialValues[f.name]);
    });
    setValidationErrors(initialErrors);
  }, [fields, initialValues]);

  const validateField = (field: SchemaField, value: any): string => {
    if (!field) return "";

    // Required check for text, number, select, date
    if (field.type === "text" || field.type === "select" || field.type === "number" || field.type === "date") {
      if (value === "" || value === null) return "Required";
    }

    if (field.type === "number") {
      if (value === "" || value === null) return "Required";

      const num = Number(value);
      if (isNaN(num)) return "Must be a number";

      // Only validate min/max if defined, else default to 0–100
      const min = field.range?.min !== undefined && field.range.min !== "" ? Number(field.range.min) : 0;
      const max = field.range?.max !== undefined && field.range.max !== "" ? Number(field.range.max) : 100;

      if (num < min) return `Min: ${min}`;
      if (num > max) return `Max: ${max}`;
    }

    if (field.type === "date") {
      if (field.range?.min && value < field.range.min) return `Min: ${field.range.min}`;
      if (field.range?.max && value > field.range.max) return `Max: ${field.range.max}`;
    }

    return "";
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    const field = fields.find((f) => f.name === fieldName);
    const error = field ? validateField(field, value) : "";
    setValidationErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    fields.forEach((f) => {
      newErrors[f.name] = validateField(f, formValues[f.name]);
    });
    setValidationErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const isSubmitDisabled = Object.values(validationErrors).some((err) => err);

  return {
    formValues,
    validationErrors,
    handleChange,
    validateAll,
    isSubmitDisabled,
    setFormValues,
    setValidationErrors,
  };
}
