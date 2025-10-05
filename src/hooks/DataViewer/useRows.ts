import { useState, useEffect } from "react";
import type { Schema, Row } from "../../types/schema";

interface UseRowsProps {
  selectedSchema: Schema | null;
  saveSchemaData?: (id: string, data: Row[]) => void;
}

export function useRows({ selectedSchema, saveSchemaData }: UseRowsProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [tempRows, setTempRows] = useState<Row[]>([]); // for editing mode

  // Load rows when schema changes
  useEffect(() => {
    if (!selectedSchema) {
      setRows([]);
      setTempRows([]);
      return;
    }
    const initial =
      selectedSchema.data ??
      JSON.parse(localStorage.getItem(`data-${selectedSchema.id}`) || "[]");
    const initialRows = Array.isArray(initial) ? initial : [];
    setRows(initialRows);
    setTempRows(initialRows);
  }, [selectedSchema]);

  const persist = (schemaId: string | number, data: Row[]) => {
    if (!schemaId) return;
    try {
      saveSchemaData?.(schemaId.toString(), data);
    } catch {
      localStorage.setItem(`data-${schemaId}`, JSON.stringify(data));
    }
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

  // ---------- Temp editing functions ----------
  const addTempRow = () => {
    if (!selectedSchema) return;
    setTempRows([...tempRows, createEmptyRow()]);
  };

  const insertTempRow = (index: number) => {
    if (!selectedSchema) return;
    const newRows = [...tempRows.slice(0, index), createEmptyRow(), ...tempRows.slice(index)];
    setTempRows(newRows);
  };

  const deleteTempRow = (index: number) => {
    if (!selectedSchema) return;
    const newRows = [...tempRows];
    newRows.splice(index, 1);
    setTempRows(newRows);
  };

  const updateTempCell = (rowIndex: number, fieldName: string, value: string | number | boolean) => {
    if (!selectedSchema) return;
    const newRows = [...tempRows];
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
    setTempRows(newRows);
  };

  // ---------- Commit edits ----------
  const saveChanges = () => {
    setRows(tempRows);
    if (selectedSchema) persist(selectedSchema.id, tempRows);
  };

  const cancelChanges = () => {
    setTempRows(rows); // revert temp to last saved
  };

  return {
    rows,         // actual saved rows
    tempRows,     // editing rows
    setRows,      // only use to set rows programmatically
    addTempRow,
    insertTempRow,
    deleteTempRow,
    updateTempCell,
    saveChanges,
    cancelChanges,
  };
}
