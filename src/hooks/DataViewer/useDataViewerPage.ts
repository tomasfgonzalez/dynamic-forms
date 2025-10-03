// src/hooks/useDataViewerPage.ts
import { useState, useEffect, useMemo } from "react";
import { useSchemas } from "../SchemaPage/useSchemas";
import type { Schema, Row } from "../../types/schema";

// --- Hook ---
export const useDataViewerPage = () => {
  const { schemas, saveSchemaData } = useSchemas();

  // --- Schema selection + rows ---
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | number | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const selectedSchema = schemas.find((s) => s.id === selectedSchemaId) || null;

  // --- Load last schema ---
  useEffect(() => {
    if (!selectedSchemaId && schemas.length > 0) {
      const lastOpenedId = localStorage.getItem("lastSchemaId");
      const schemaToSelect =
        schemas.find((s) => s.id === lastOpenedId) || schemas[schemas.length - 1];
      setSelectedSchemaId(schemaToSelect.id);
    }
  }, [schemas, selectedSchemaId]);

  useEffect(() => {
    if (selectedSchemaId) localStorage.setItem("lastSchemaId", selectedSchemaId.toString());
  }, [selectedSchemaId]);

  // --- Load rows when schema changes ---
  useEffect(() => {
    if (!selectedSchema) {
      setRows([]);
      setCurrentPage(1);
      return;
    }
    const initial =
      selectedSchema.data ??
      JSON.parse(localStorage.getItem(`data-${selectedSchema.id}`) || "[]");
    setRows(Array.isArray(initial) ? initial : []);
    setCurrentPage(1);
  }, [selectedSchemaId, selectedSchema]);

  // --- Persist rows ---
  const persist = (schemaId: string | number, data: Row[]) => {
    if (!schemaId) return;
    if (typeof saveSchemaData === "function") {
      try {
        saveSchemaData(schemaId.toString(), data);
      } catch {
        localStorage.setItem(`data-${schemaId}`, JSON.stringify(data));
      }
    } else {
      localStorage.setItem(`data-${schemaId}`, JSON.stringify(data));
    }
  };

  const replaceRows = (newRows: Row[]) => {
    setRows(newRows);
    if (selectedSchemaId) persist(selectedSchemaId, newRows);
  };

  // --- Row operations ---
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
    setRows((prevRows) => {
      const newRows = [...prevRows, createEmptyRow()];
      persist(selectedSchema.id, newRows);

      const filteredAfterAdd = newRows.filter((r) => matchesSearch(r, selectedSchema, search));
      setCurrentPage(Math.max(1, Math.ceil(filteredAfterAdd.length / rowsPerPage)));

      return newRows;
    });
  };

  const insertRow = (index: number) => {
    if (!selectedSchema) return;
    setRows((prevRows) => {
      const newRows = [...prevRows.slice(0, index), createEmptyRow(), ...prevRows.slice(index)];
      persist(selectedSchema.id, newRows);
      return newRows;
    });
  };

  const deleteRow = (index: number) => {
    if (!selectedSchema) return;
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows.splice(index, 1);
      persist(selectedSchema.id, newRows);
      return newRows;
    });
  };

  const updateCell = (rowIndex: number, fieldName: string, value: string | number | boolean) => {
    if (!selectedSchema) return;
    setRows((prevRows) => {
      const newRows = [...prevRows];
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
      persist(selectedSchema.id, newRows);
      return newRows;
    });
  };

  // --- Search ---
  const matchesSearch = (row: Row, schema: Schema, q: string) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return schema.fields.some((f) => {
      if (f.type === "checkbox") return false;
      const value = row?.[f.name];
      return value !== undefined && value !== null && String(value).toLowerCase().includes(lower);
    });
  };

  const filteredRows = useMemo(() => {
    if (!selectedSchema) return [];
    return rows.filter((row) => matchesSearch(row, selectedSchema, search));
  }, [rows, selectedSchema, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [filteredRows, totalPages, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // --- Column navigation ---
  const [colStart, setColStart] = useState(0);
  const colsPerPage = 10;

  // --- Edit mode ---
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState<Row[]>([]);

  const handleEnterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(filteredRows)));
    setEditMode(true);
  };
  const handleSave = () => {
    setBackupRows([]);
    setEditMode(false);
  };
  const handleCancel = () => {
    setRows(backupRows);
    setBackupRows([]);
    setEditMode(false);
  };

  return {
    schemas,
    selectedSchema,
    selectedSchemaId,
    setSelectedSchemaId,
    rows,
    filteredRows,
    search,
    setSearch,
    currentPage,
    totalPages,
    rowsPerPage,
    addRow,
    insertRow,
    deleteRow,
    updateCell,
    goToPage,
    setRows: replaceRows,
    colStart,
    setColStart,
    colsPerPage,
    editMode,
    handleEnterEdit,
    handleSave,
    handleCancel,
  };
};
