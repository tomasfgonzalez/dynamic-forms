// src/hooks/useDataViewerPageLogic.ts
import { useState } from "react";
import  useFormPageData  from "./useFormPageData";

export const useDataViewerPageLogic = () => {
  const {
    fadeIn,
    schemas,
    selectedSchema,
    selectedSchemaId,
    setSelectedSchemaId,
    filteredRows,
    setRows,
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
  } = useFormPageData();

  // Column navigation state
  const [colStart, setColStart] = useState(0);
  const colsPerPage = 10;

  // Edit mode + backup state
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState<any[]>([]);

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
    fadeIn,
    schemas,
    selectedSchema,
    selectedSchemaId,
    setSelectedSchemaId,
    filteredRows,
    setRows,
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
    colStart,
    setColStart,
    colsPerPage,
    editMode,
    handleEnterEdit,
    handleSave,
    handleCancel,
  };
};
