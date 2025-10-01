import React, { useState } from "react";
import type { SchemaField } from "../../hooks/useFormPageData";
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
}: DataTableProps) {
  const [colStart, setColStart] = useState(0);
  const colsPerPage = 10;

  const totalCols = schema.fields.length;
  const visibleFields = schema.fields.slice(colStart, colStart + colsPerPage);
  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getValidationMessage = (value: any, field: SchemaField): string => {
    if (!field.range) return "";
    const { min, max } = field.range;
    if ((min === undefined || min === "") && (max === undefined || max === "")) return "";

    if (field.type === "number") {
      if (value === "") return "";
      const num = Number(value);
      if (isNaN(num)) return "Must be a number";
      if (min !== undefined && min !== "" && num < Number(min)) return `Min: ${min}`;
      if (max !== undefined && max !== "" && num > Number(max)) return `Max: ${max}`;
      return "";
    }

    if (field.type === "date") {
      if (!value) return "";
      if (min && value < min) return `Min date: ${min}`;
      if (max && value > max) return `Max date: ${max}`;
      return "";
    }

    return "";
  };

  return (
    <div id="data-table-wrapper" className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {editMode && <th>Actions</th>}
            {visibleFields.map((f) => (
              <th key={f.name}>{f.name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedRows.map((row, rowIndex) => {
            const realIndex = (currentPage - 1) * rowsPerPage + rowIndex;
            return (
              <tr key={realIndex}>
                {editMode && (
                  <td className="row-buttons-cell">
                    <button onClick={() => insertRow(realIndex)}>Insert</button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this row?"))
                          deleteRow(realIndex);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
                {visibleFields.map((f) => {
                  const value = row[f.name];

                  if (f.type === "checkbox") {
                    return (
                      <td key={f.name}>
                        <input
                          type="checkbox"
                          checked={!!value}
                          disabled={!editMode}
                          onChange={(e) =>
                            updateCell(realIndex, f.name, e.target.checked)
                          }
                        />
                      </td>
                    );
                  }

                  if (f.type === "select") {
                    return (
                      <td key={f.name}>
                        <select
                          value={value}
                          disabled={!editMode}
                          onChange={(e) =>
                            updateCell(realIndex, f.name, e.target.value)
                          }
                        >
                          {(f.options || []).map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  }

                  return (
                    <td key={f.name}>
                      <input
                        className="cell-input"
                        type={f.type === "number" ? "number" : f.type}
                        value={value}
                        disabled={!editMode}
                        onChange={(e) =>
                          updateCell(realIndex, f.name, e.target.value)
                        }
                        style={{
                          border: getValidationMessage(value, f)
                            ? "1px solid red"
                            : "none",
                        }}
                      />
                      {getValidationMessage(value, f) && (
                        <div className="validation-msg">
                          {getValidationMessage(value, f)}
                        </div>
                      )}
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
