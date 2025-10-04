import { useState } from "react";
import type { Row, Schema } from "../../types/schema";
import { useValidation } from "./useValidation";

export function useEditMode(
  filteredRows: Row[],
  setRows: (rows: Row[]) => void,
  schema: Schema | null
) {
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState<Row[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const { hasAnyErrors } = useValidation(schema);

  const handleEnterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(filteredRows)));
    setEditMode(true);
    setShowErrors(false);
  };

  const handleSave = () => {
    if (hasAnyErrors(filteredRows)) {
      setShowErrors(true);
      alert("Cannot save: there are validation errors in some rows.");
      return;
    }
    setBackupRows([]);
    setEditMode(false);
  };

  const handleCancel = () => {
    setRows(backupRows);
    setBackupRows([]);
    setEditMode(false);
    setShowErrors(false);
  };

  return { editMode, handleEnterEdit, handleSave, handleCancel, showErrors };
}
