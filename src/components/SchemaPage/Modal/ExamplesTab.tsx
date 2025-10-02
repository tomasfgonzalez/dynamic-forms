import React from "react";
import type { Schema } from "../../../hooks/SchemaPage/useSchemas";
import "../CreateModal.css";

const exampleSchemas: Schema[] = [
  {
    id: Date.now().toString() + "-1",
    name: "User Info",
    fields: [
      { name: "Name", type: "text" },
      { name: "Email", type: "text" },
      { name: "Age", type: "number" },
    ],
  },
  {
    id: Date.now().toString() + "-2",
    name: "Task Tracker",
    fields: [
      { name: "Task", type: "text" },
      { name: "Due Date", type: "date" },
      { name: "Completed", type: "checkbox" },
    ],
  },
  {
    id: Date.now().toString() + "-3",
    name: "Favorite Fruit",
    fields: [
      { name: "Fruit", type: "select", options: ["Apple", "Banana", "Orange"] },
    ],
  },
  {
    id: Date.now().toString() + "-4",
    name: "User Survey",
    fields: [
      { name: "Full Name", type: "text" },
      { name: "Age", type: "number", range: { min: 0, max: 120 } },
      { name: "Email", type: "text" },
      { name: "Subscribe to Newsletter", type: "checkbox" },
      { name: "Birthday", type: "date", range: { min: "1900-01-01", max: "2025-12-31" } },
      { name: "Gender", type: "select", options: ["Male", "Female", "Other"] },
      { name: "Country", type: "select", options: ["USA", "Canada", "Argentina", "Other"] },
      { name: "Rating", type: "number", range: { min: 1, max: 5 } },
    ],
  },
];

interface Props {
  onSelect: (schema: Schema) => void;
  onCancel: () => void;
}

export default function ExampleSchemas({ onSelect, onCancel }: Props) {
  return (
    <>
      <h2>Try Our Examples</h2>
      <div className="examples-list">
        {exampleSchemas.map((ex) => (
          <button key={ex.id} className="example-button" onClick={() => onSelect(ex)}>
            {ex.name}
          </button>
        ))}
      </div>
      <div className="modal-actions">
        <button onClick={onCancel}>Back</button>
      </div>
    </>
  );
}
