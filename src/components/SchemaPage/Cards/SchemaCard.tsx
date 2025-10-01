import React from "react";
import { Schema } from "../../../hooks/SchemaPage/useSchemas";

interface Props {
  schema: Schema;
  fadeIn: boolean;
  delay: number;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SchemaCard({ schema, fadeIn, delay, onUse, onEdit, onDelete }: Props) {
  return (
    <div
      className={`schema-card ${fadeIn ? "fade-in-card show" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onUse}
    >
      <button className="delete-cross" onClick={(e) => { e.stopPropagation(); onDelete(); }}>×</button>
      <h3>{schema.name}</h3>
      <div className="schema-fields-wrapper">
        <div className="schema-fields">
          {schema.fields.length === 0 ? <p>No fields</p> : null}
          {schema.fields.slice(0, 10).map((f, i) => (
            <div key={`${schema.id}-field-${i}`} className="schema-field" style={{ opacity: Math.max(1 - i * 0.09, 0) }}>
              {f.name} ({f.type})
            </div>
          ))}
        </div>
      </div>
      <div className="schema-card-buttons">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit Fields</button>
      </div>
    </div>
  );
}
