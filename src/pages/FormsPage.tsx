import React, { useEffect, useState } from "react";
import { useFadeIn } from "../hooks/useFadeIn";
import { useFormValidation } from "../hooks/FormPage/useFormValidation";
import { useSelectedSchema } from "../hooks/FormPage/useSelectedSchema";
import { useSubmitData } from "../hooks/FormPage/useSubmitData";
import type { Row } from "../types/schema";
import "./FormsPage.css";

export default function FormsPage() {
  const fadeIn = useFadeIn();
  const { selectedSchema, loading } = useSelectedSchema();
  const { submitData } = useSubmitData();

  const [initialValues, setInitialValues] = useState<Record<string, any>>({});

  // Initialize empty form values when schema changes
  useEffect(() => {
    if (!selectedSchema) return;
    const values: Record<string, any> = {};
    selectedSchema.fields.forEach((f) => {
      if (f.type === "checkbox") values[f.name] = false;
      else if (f.type === "select") values[f.name] = f.options?.[0] || "";
      else values[f.name] = "";
    });
    setInitialValues(values);
  }, [selectedSchema]);

  const {
    formValues,
    validationErrors,
    handleChange,
    validateAll,
    setFormValues,
    isSubmitDisabled,
  } = useFormValidation(selectedSchema?.fields || [], initialValues);

  // Reset formValues whenever initialValues change
  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchema) return;
    if (!validateAll()) return;

    submitData(formValues as Row, selectedSchema);

    alert("Form submitted!");

    // Clear form
    const clearedValues: Record<string, any> = {};
    selectedSchema.fields.forEach((f) => {
      if (f.type === "checkbox") clearedValues[f.name] = false;
      else if (f.type === "select") clearedValues[f.name] = f.options?.[0] || "";
      else clearedValues[f.name] = "";
    });
    setFormValues(clearedValues);
  };

  if (loading) return <p>Loading schema...</p>;
  if (!selectedSchema) return <p>Schema not found.</p>;

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

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`btn blue ${isSubmitDisabled ? "disabled" : ""}`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
