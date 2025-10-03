import React, { useEffect, useState } from "react";
import useFormPageData from "../hooks/DataViewer/useFormPageData";
import { useFadeIn } from "../hooks/useFadeIn";
import { useFormValidation } from "../hooks/FormPage/useFormValidation";
import { useSelectedSchema } from "../hooks/FormPage/useSelectedSchema";
import "./FormsPage.css";

export default function FormsPage() {
  const { addRow, updateCell } = useFormPageData();
  const fadeIn = useFadeIn();
  const { selectedSchema, loading } = useSelectedSchema();

  const [initialValues, setInitialValues] = useState<{ [key: string]: any }>({});

  // Initialize empty values when schema changes
  useEffect(() => {
    if (!selectedSchema) return;
    const values: { [key: string]: any } = {};
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
    isSubmitDisabled,
  } = useFormValidation(selectedSchema?.fields || [], initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchema) return;
    if (!validateAll()) return;

    addRow();
    const newRowIndex = selectedSchema.data?.length || 0;
    Object.entries(formValues).forEach(([key, value]) => {
      updateCell(newRowIndex, key, value);
    });

    alert("Form submitted!");
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

        <button type="submit" disabled={isSubmitDisabled} className={isSubmitDisabled ? "disabled" : ""}>
          Submit
        </button>
      </form>
    </div>
  );
}
