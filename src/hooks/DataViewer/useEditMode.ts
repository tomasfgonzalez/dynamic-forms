import { useState } from "react";
import type { Row } from "../../types/schema";

export function useEditMode(filteredRows: Row[], setRows: (rows: Row[]) => void) {
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

  return { editMode, handleEnterEdit, handleSave, handleCancel };
}
