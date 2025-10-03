// src/components/DataViewerComponents/SearchBar.tsx
import React from "react";
import type { Schema, SchemaField, FieldWithRange } from "./../../types/schema";
import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  schemaFields?: FieldWithRange[];
  selectedColumns: string[];
  setSelectedColumns: (cols: string[]) => void;
}

export default function SearchBar({
  value,
  onChange,
  schemaFields = [],
  selectedColumns,
  setSelectedColumns,
}: SearchBarProps) {
  const toggleColumn = (colName: string) => {
    if (selectedColumns.includes(colName)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== colName));
    } else {
      setSelectedColumns([...selectedColumns, colName]);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {schemaFields.length > 0 && (
        <div className="search-columns">
          {schemaFields.map((f) =>
            f.type !== "checkbox" ? (
              <label key={f.name}>
                <input
                  type="checkbox"
                  checked={
                    selectedColumns.length === 0
                      ? true
                      : selectedColumns.includes(f.name)
                  }
                  onChange={() => toggleColumn(f.name)}
                />
                {f.name}
              </label>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
