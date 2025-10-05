import { useState } from "react";
import type { Row, Schema } from "../../types/schema";
import { useValidation } from "./useValidation";

export function useEditMode(
  tempRows: Row[],
  saveChanges: (newRows: Row[]) => void,  // commit changes to actual rows
  cancelChanges: () => void,              // revert tempRows
  schema: Schema | null
) {
  const [editMode, setEditMode] = useState(false);
  const [backupRows, setBackupRows] = useState<Row[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const { hasAnyErrors } = useValidation(schema);

  const handleEnterEdit = () => {
    setBackupRows(JSON.parse(JSON.stringify(tempRows))); // backup tempRows
    setEditMode(true);
    setShowErrors(false);
  };

  const handleSave = () => {
    if (hasAnyErrors(tempRows)) {
      setShowErrors(true);
      alert("Cannot save: there are validation errors in some rows.");
      return;
    }

    saveChanges(tempRows); // commit tempRows to actual rows
    setBackupRows([]);
    setEditMode(false);
    setShowErrors(false);
  };

  const handleCancel = () => {
    cancelChanges(); // revert tempRows to backup
    setBackupRows([]);
    setEditMode(false);
    setShowErrors(false);
  };

  return { editMode, handleEnterEdit, handleSave, handleCancel, showErrors };
}
