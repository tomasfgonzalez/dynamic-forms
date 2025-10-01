// src/pages/FormsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFormPageData from "../hooks/useFormPageData";
import { useFadeIn } from "../hooks/useFadeIn"; // <-- import the hook
import "./FormsPage.css";

export default function FormsPage() {
  const { schemaName } = useParams();
  const {
    schemas,
    selectedSchema,
    setSelectedSchemaId,
    addRow,
    updateCell,
  } = useFormPageData();

  const fadeIn = useFadeIn(); // <-- apply fade-in class

  // Use index signatures to allow dynamic keys
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Update selected schema based on URL
  useEffect(() => {
    if (!schemaName || schemas.length === 0) return;

    const decodedName = decodeURIComponent(schemaName);
    const schema = schemas.find((s) => s.name === decodedName);

    if (schema) {
      setSelectedSchemaId(schema.id);
    } else {
      alert("Schema not found!");
    }
  }, [schemaName, schemas, setSelectedSchemaId]);

  // Initialize empty form when selected schema changes
  useEffect(() => {
    if (!selectedSchema) return;

    const initial: { [key: string]: any } = {};
    const initialErrors: { [key: string]: string } = {};
    selectedSchema.fields.forEach((f) => {
      if (f.type === "checkbox") initial[f.name] = false;
      else if (f.type === "select") initial[f.name] = f.options?.[0] || "";
      else initial[f.name] = "";
      initialErrors[f.name] = ""; // no errors initially
    });
    setFormValues(initial);
    setValidationErrors(initialErrors);
  }, [selectedSchema]);

  const validateField = (field: any, value: any) => {
    if (!field) return "";
    let error = "";

    if (field.type !== "checkbox" && (value === "" || value === null)) {
      error = "Required";
      return error;
    }

    if (field.type === "number") {
      const num = Number(value);
      if (isNaN(num)) error = "Must be a number";
      else if (field.range?.min !== undefined && num < field.range.min)
        error = `Min: ${field.range.min}`;
      else if (field.range?.max !== undefined && num > field.range.max)
        error = `Max: ${field.range.max}`;
    }

    if (field.type === "date") {
      if (field.range?.min && value < field.range.min) error = `Min: ${field.range.min}`;
      if (field.range?.max && value > field.range.max) error = `Max: ${field.range.max}`;
    }

    return error;
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    const field = selectedSchema?.fields.find((f) => f.name === fieldName);
    const error = validateField(field, value);
    setValidationErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchema) return;

    const newErrors: { [key: string]: string } = {};
    selectedSchema.fields.forEach((f) => {
      newErrors[f.name] = validateField(f, formValues[f.name]);
    });
    setValidationErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err);
    if (hasErrors) return;

    addRow();
    const newRowIndex = selectedSchema.data?.length || 0;
    Object.entries(formValues).forEach(([key, value]) => {
      updateCell(newRowIndex, key, value);
    });

    alert("Form submitted!");
  };

  if (!selectedSchema) return <p>Loading schema...</p>;

  const isSubmitDisabled = Object.values(validationErrors).some((err) => err);

  return (
    <div className={`forms-page-container ${fadeIn ? "fade-in" : ""}`}>
      <h2>{selectedSchema.name} Form</h2>
      <form onSubmit={handleSubmit} className="forms-page-form">
        {selectedSchema.fields.map((f) => (
          <div key={f.name} className="form-field">
            <label>{f.name}</label>
            {f.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={formValues[f.name]}
                onChange={(e) => handleChange(f.name, e.target.checked)}
              />
            ) : f.type === "select" ? (
              <select
                value={formValues[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
                style={{ borderColor: validationErrors[f.name] ? "red" : "#ccc" }}
              >
                {(f.options || []).map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type}
                value={formValues[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
                style={{ borderColor: validationErrors[f.name] ? "red" : "#ccc" }}
              />
            )}
            {validationErrors[f.name] && (
              <div className="validation-msg">{validationErrors[f.name]}</div>
            )}
          </div>
        ))}

        <button type="submit" disabled={isSubmitDisabled}>
          Submit
        </button>
      </form>
    </div>
  );
}
