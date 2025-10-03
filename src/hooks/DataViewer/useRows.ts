import { useState, useEffect } from "react";
import type { Schema, Row } from "../../types/schema";

interface UseRowsProps {
  selectedSchema: Schema | null;
  saveSchemaData?: (id: string, data: Row[]) => void;
}

export function useRows({ selectedSchema, saveSchemaData }: UseRowsProps) {
  const [rows, setRows] = useState<Row[]>([]);

  // Load rows when schema changes
  useEffect(() => {
    if (!selectedSchema) {
      setRows([]);
      return;
    }
    const initial =
      selectedSchema.data ??
      JSON.parse(localStorage.getItem(`data-${selectedSchema.id}`) || "[]");
    setRows(Array.isArray(initial) ? initial : []);
  }, [selectedSchema]);

  const persist = (schemaId: string | number, data: Row[]) => {
    if (!schemaId) return;
    try {
      saveSchemaData?.(schemaId.toString(), data);
    } catch {
      localStorage.setItem(`data-${schemaId}`, JSON.stringify(data));
    }
  };

  const replaceRows = (newRows: Row[]) => {
    setRows(newRows);
    if (selectedSchema) persist(selectedSchema.id, newRows);
  };

  const createEmptyRow = (): Row => {
    const row: Row = {};
    selectedSchema?.fields.forEach((f) => {
      if (f.type === "checkbox") row[f.name] = false;
      else if (f.type === "select") row[f.name] = f.options?.[0] ?? "";
      else row[f.name] = "";
    });
    return row;
  };

  const addRow = () => {
    if (!selectedSchema) return;
    const newRows = [...rows, createEmptyRow()];
    replaceRows(newRows);
  };

  const insertRow = (index: number) => {
    if (!selectedSchema) return;
    const newRows = [...rows.slice(0, index), createEmptyRow(), ...rows.slice(index)];
    replaceRows(newRows);
  };

  const deleteRow = (index: number) => {
    if (!selectedSchema) return;
    const newRows = [...rows];
    newRows.splice(index, 1);
    replaceRows(newRows);
  };

  const updateCell = (rowIndex: number, fieldName: string, value: string | number | boolean) => {
    if (!selectedSchema) return;
    const newRows = [...rows];
    const field = selectedSchema.fields.find((f) => f.name === fieldName);
    if (field?.type === "number") {
      if (value === "") newRows[rowIndex][fieldName] = "";
      else {
        const num = Number(value);
        newRows[rowIndex][fieldName] = Number.isNaN(num) ? value : num;
      }
    } else {
      newRows[rowIndex][fieldName] = value;
    }
    replaceRows(newRows);
  };

  return { rows, setRows: replaceRows, addRow, insertRow, deleteRow, updateCell };
}
