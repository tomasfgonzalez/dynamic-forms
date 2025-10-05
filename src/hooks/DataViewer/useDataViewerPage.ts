import { useState } from "react";

import { useSchemas } from "../SchemaPage/useSchemas";
import type { Schema, Row } from "../../types/schema";
import { useSchemaSelection } from "./useSchemaSelection";
import { useRows } from "./useRows";
import { usePagination } from "./usePagination";
import { useEditMode } from "./useEditMode";

export const useDataViewerPage = () => {
  const { schemas, saveSchemaData } = useSchemas();

  // schema selection
  const { selectedSchemaId, setSelectedSchemaId, selectedSchema } = useSchemaSelection(schemas);

  // rows CRUD (updated for tempRows)
  const {
    rows,       // actual saved rows
    tempRows,   // temporary rows for editing
    addTempRow,
    insertTempRow,
    deleteTempRow,
    updateTempCell,
    saveChanges,
    cancelChanges,
  } = useRows({ selectedSchema, saveSchemaData });


  // column navigation
  const [colStart, setColStart] = useState(0);
  const colsPerPage = 8;
  const rowsPerPage = 10;


  // search & pagination works on tempRows if editing, otherwise on rows
  const {
    search,
    setSearch,
    filteredRows,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(tempRows, selectedSchema, rowsPerPage);

  // edit mode
  const { editMode, handleEnterEdit, handleSave, handleCancel, showErrors } = useEditMode(
    tempRows,
    saveChanges,     // commit tempRows only on save
    cancelChanges,   // revert tempRows on cancel
    selectedSchema
  );


  return {
    schemas,
    selectedSchema,
    selectedSchemaId,
    setSelectedSchemaId,
    rows,            // actual saved rows
    tempRows,        // editing rows
    filteredRows,
    search,
    setSearch,
    currentPage,
    totalPages,
    addRow: addTempRow,
    insertRow: insertTempRow,
    deleteRow: deleteTempRow,
    updateCell: updateTempCell,
    goToPage,
    colStart,
    setColStart,
    colsPerPage,
    rowsPerPage,
    editMode,
    handleEnterEdit,
    handleSave,
    handleCancel,
    showErrors,
    saveChanges,
    cancelChanges,
  };
};
