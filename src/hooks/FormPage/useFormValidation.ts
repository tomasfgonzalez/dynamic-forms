import { useState, useEffect } from "react";
import { SchemaField } from "../DataViewer/useFormPageData";

export function useFormValidation(fields: SchemaField[], initialValues: { [key: string]: any }) {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>(initialValues);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialErrors: { [key: string]: string } = {};
    fields.forEach((f) => {
      initialErrors[f.name] = "";
    });
    setValidationErrors(initialErrors);
  }, [fields]);

  const validateField = (field: SchemaField, value: any): string => {
    if (!field) return "";

    // Required check
    if (field.type !== "checkbox" && (value === "" || value === null)) {
      return "Required";
    }

    if (field.type === "number") {
      const num = Number(value);
      if (isNaN(num)) return "Must be a number";

      // Only validate min/max if defined
      if (field.range?.min !== undefined && num < Number(field.range.min)) {
        return `Min: ${field.range.min}`;
      }
      if (field.range?.max !== undefined && num > Number(field.range.max)) {
        return `Max: ${field.range.max}`;
      }
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
