import { useState } from "react";
import { useSchemas } from "../SchemaPage/useSchemas";
import { useSchemaSelection } from "./useSchemaSelection";
import { useRows } from "./useRows";
import { usePagination } from "./usePagination";
import { useEditMode } from "./useEditMode";

export const useDataViewerPage = () => {
  const { schemas, saveSchemaData } = useSchemas();

  // schema selection
  const { selectedSchemaId, setSelectedSchemaId, selectedSchema } = useSchemaSelection(schemas);

  // rows CRUD
  const { rows, setRows, addRow, insertRow, deleteRow, updateCell } = useRows({ selectedSchema, saveSchemaData });

  // column & row config
  const [colStart, setColStart] = useState(0);
  const colsPerPage = 10;
  const rowsPerPage = 10;

  // search & pagination
  const {
    search,
    setSearch,
    filteredRows,
    paginatedRows,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(rows, selectedSchema, rowsPerPage);

  // edit mode
  const { editMode, handleEnterEdit, handleSave, handleCancel } = useEditMode(filteredRows, setRows);

  return {
    schemas,
    selectedSchema,
    selectedSchemaId,
    setSelectedSchemaId,
    rows,
    filteredRows,
    paginatedRows,       // <-- use this for table
    search,
    setSearch,
    currentPage,
    totalPages,
    addRow,
    insertRow,
    deleteRow,
    updateCell,
    goToPage,
    setRows,
    colStart,
    setColStart,
    colsPerPage,
    rowsPerPage,
    editMode,
    handleEnterEdit,
    handleSave,
    handleCancel,
  };
};
