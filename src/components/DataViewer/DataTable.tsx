// src/components/DataViewerComponents/DataTable.tsx
import React, { useState, useMemo } from "react";
import type { SchemaField } from "../../types/schema";
import "./DataTable.css";

interface DataTableProps {
  schema: { name: string; fields: SchemaField[] };
  rows: Record<string, any>[];
  currentPage: number;
  rowsPerPage: number;
  updateCell: (rowIndex: number, fieldName: string, value: any) => void;
  addRow: () => void;
  insertRow: (index: number) => void;
  deleteRow: (index: number) => void;
  editMode: boolean;
  colStart: number;
  colsPerPage: number;
  showErrors: boolean;
}

export default function DataTable({
  schema,
  rows,
  currentPage,
  rowsPerPage,
  updateCell,
  insertRow,
  deleteRow,
  editMode,
  colStart,
  colsPerPage,
  showErrors,
}: DataTableProps) {
  const visibleFields = schema.fields.slice(colStart, colStart + colsPerPage);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: "asc" | "desc" | null } | null>(null);

  const handleSort = (field: string) => {
    if (editMode) return; // Only allow sorting when not editing

    setSortConfig((prev) => {
      if (!prev || prev.field !== field) {
        return { field, direction: "asc" };
      }
      if (prev.direction === "asc") return { field, direction: "desc" };
      return null;
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig || editMode || sortConfig.direction === null) return rows;

    const { field, direction } = sortConfig;
    return [...rows].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return direction === "asc" ? valA - valB : valB - valA;
      }

      return direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [rows, sortConfig, editMode]);

  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Validate individual cell
  const getValidationMessage = (value: any, field: SchemaField): string => {
    if (field.type === "checkbox") return "";

    if (value === "" || value === null || value === undefined) return "Required";
    if (!field.range) return "";

    const { min, max } = field.range;

    if (field.type === "number") {
      const num = Number(value);
      if (isNaN(num)) return "Must be a number";
      if (min !== undefined && min !== "" && num < Number(min)) return `Min: ${min}`;
      if (max !== undefined && max !== "" && num > Number(max)) return `Max: ${max}`;
      return "";
    }

    if (field.type === "text") {
      if (min && value.length < Number(min)) return `Min length: ${min}`;
      if (max && value.length > Number(max)) return `Max length: ${max}`;
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

  const validateRow = (row: Record<string, any>) => {
    const errors: Record<string, string> = {};
    visibleFields.forEach((f) => {
      const msg = getValidationMessage(row[f.name], f);
      if (msg) errors[f.name] = msg;
    });
    return errors;
  };

  return (
    <div id="data-table-wrapper" className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {editMode && <th className="actions-col">Actions</th>}
            {visibleFields.map((f) => (
              <th
                key={f.name}
                onClick={() => handleSort(f.name)}
                style={{ cursor: editMode ? "default" : "pointer" }}
              >
                {f.name}
                {!editMode && sortConfig?.field === f.name && (
                  <span>{sortConfig.direction === "asc" ? " ▲" : sortConfig.direction === "desc" ? " ▼" : ""}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, rowIndex) => {
            const realIndex = (currentPage - 1) * rowsPerPage + rowIndex;
            const rowErrors = validateRow(row);

            return (
              <tr key={realIndex} className={Object.keys(rowErrors).length > 0 ? "invalid-row" : ""}>
                {editMode && (
                  <td className="row-buttons-cell actions-col">
                    <button onClick={() => insertRow(realIndex)}>Insert</button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this row?")) deleteRow(realIndex);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
                {visibleFields.map((f) => {
                  const value = row[f.name];
                  const errorMsg = rowErrors[f.name];

                  if (f.type === "checkbox") {
                    return (
                      <td key={f.name}>
                        <input
                          type="checkbox"
                          checked={!!value}
                          disabled={!editMode}
                          onChange={(e) => updateCell(realIndex, f.name, e.target.checked)}
                        />
                      </td>
                    );
                  }

                  if (f.type === "select") {
                    return (
                      <td key={f.name}>
                        <select
                          value={typeof value === "boolean" ? String(value) : value ?? ""}
                          disabled={!editMode}
                          onChange={(e) => updateCell(realIndex, f.name, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {(f.options || []).map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {showErrors && errorMsg && <div className="validation-msg">{errorMsg}</div>}
                      </td>
                    );
                  }

                  return (
                    <td key={f.name}>
                      <input
                        className={`cell-input ${showErrors && errorMsg ? "invalid" : ""}`}
                        type={f.type === "number" ? "number" : f.type}
                        value={typeof value === "boolean" ? String(value) : value ?? ""}
                        disabled={!editMode}
                        onChange={(e) => updateCell(realIndex, f.name, e.target.value)}
                      />
                      {showErrors && errorMsg && <div className="validation-msg">{errorMsg}</div>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
