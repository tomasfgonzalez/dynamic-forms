// src/pages/DataViewerPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDataViewerPage } from "../hooks/DataViewer/useDataViewerPage";
import { useFadeIn } from "../hooks/useFadeIn";
import DataTable from "../components/DataViewer/DataTable";
import TableNavigation from "../components/DataViewer/TableNavigation";
import Pagination from "../components/DataViewer/Pagination";
import ExportCSVButton from "../components/DataViewer/ExportCSVButton";
import Button from "../components/Button";
import "./DataViewerPage.css";

const DataViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const fadeIn = useFadeIn();

  const {
    schemas,
    selectedSchema,
    selectedSchemaId,
    setSelectedSchemaId,
    filteredRows,
    search,
    setSearch,
    currentPage,
    totalPages,
    addRow,
    insertRow,
    deleteRow,
    updateCell,
    goToPage,
    colStart,
    setColStart,
    colsPerPage,
    rowsPerPage,
    editMode,
    handleEnterEdit,
    handleSave,
    handleCancel,
  } = useDataViewerPage();

  return (
    <div className="form-page-container">
      {schemas.length === 0 && (
        <>
          <h1 className={`form-page-title ${fadeIn ? "fade-in" : ""}`}>
            Form Viewer
          </h1>
          <div className={`no-schemas-message ${fadeIn ? "fade-in" : ""}`}>
            <p>Select a schema to view and manage your data. If none exists, create one first!</p>
            <Button variant="hero" onClick={() => navigate("/schemas")}>
              Go to Schemas
            </Button>
          </div>
        </>
      )}

      {schemas.length > 0 && selectedSchema && (
        <>
          <div className="schema-selector">
            <label>Select Schema:</label>
            <select
              value={selectedSchemaId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSchemaId(value ? value : null);
                setSearch("");
                setColStart(0);
              }}
            >
              {schemas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {selectedSchema.fields.length > colsPerPage && (
            <TableNavigation
              colStart={colStart}
              setColStart={setColStart}
              totalCols={selectedSchema.fields.length}
              colsPerPage={colsPerPage}
            />
          )}

          {selectedSchema.fields.length > 0 ? (
            <DataTable
              schema={selectedSchema}
              rows={filteredRows}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              updateCell={updateCell}
              insertRow={insertRow}
              deleteRow={deleteRow}
              addRow={addRow}
              editMode={editMode}
              colStart={colStart}
              colsPerPage={colsPerPage}
            />
          ) : (
            <div className={`no-fields-message ${fadeIn ? "fade-in" : ""}`}>
              This schema has no fields yet.
            </div>
          )}

          <div className="edit-buttons">
            {!editMode ? (
              <>
                <Button variant="normal" onClick={handleEnterEdit}>
                  Edit
                </Button>
                <ExportCSVButton
                  data={filteredRows}
                  fields={selectedSchema.fields}
                  filename={`${selectedSchema.name.replace(/\s+/g, "_")}_data.csv`}
                />
              </>
            ) : (
              <>
                <Button variant="normal" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="gray" onClick={handleCancel}>
                  Cancel Changes
                </Button>
                <Button variant="normal" onClick={addRow}>
                  Add Row
                </Button>
              </>
            )}
          </div>

          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DataViewerPage;
