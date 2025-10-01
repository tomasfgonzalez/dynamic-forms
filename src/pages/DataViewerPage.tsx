// src/pages/DataViewerPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFormPageData from "../hooks/useFormPageData";
import DataTable from "../components/DataViewerComponents/DataTable";
import TableNavigation from "../components/DataViewerComponents/TableNavigation";
import Pagination from "../components/DataViewerComponents/Pagination";
import "./DataViewerPage.css";

const DataViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    fadeIn,
    schemas,
    selectedSchema,
    selectedSchemaId,
    setSelectedSchemaId,
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
  } = useFormPageData();

  // Column navigation state
  const [colStart, setColStart] = useState(0);
  const colsPerPage = 10;

  // Edit mode state
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="form-page-container">
      <h1 className={`form-page-title ${fadeIn ? "fade-in" : ""}`}>
        Form Viewer
      </h1>

      {/* No schemas message */}
      {schemas.length === 0 && (
        <div className="no-schemas-message fade-in">
          <p>
            Select a schema to view and manage your data. If none exists, create
            one first!
          </p>
          <button
            className="hero-button"
            onClick={() => navigate("/schemas")}
          >
            Go to Schemas
          </button>
        </div>
      )}

      {schemas.length > 0 && selectedSchema && (
        <>
          {/* Schema selector */}
          <div className="schema-selector">
            <label>Select Schema:</label>
            <select
              value={selectedSchemaId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSchemaId(value ? value : null);
                setSearch("");
                setColStart(0); // reset column start
              }}
            >
              {schemas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table navigation */}
          {selectedSchema.fields.length > colsPerPage && (
            <TableNavigation
              colStart={colStart}
              setColStart={setColStart}
              totalCols={selectedSchema.fields.length}
              colsPerPage={colsPerPage}
            />
          )}

          {/* Data table */}
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
              colStart={colStart}      // pass colStart
              colsPerPage={colsPerPage} // pass colsPerPage
            />
          ) : (
            <div className="no-fields-message fade-in">
              This schema has no fields yet.
            </div>
          )}

          {/* Edit buttons */}
          <div className="edit-buttons">
            {!editMode ? (
              <button
                className="hero-button edit"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  className="hero-button save"
                  onClick={() => setEditMode(false)}
                >
                  Save Changes
                </button>
                <button
                  className="hero-button cancel"
                  onClick={() => setEditMode(false)}
                >
                  Cancel Changes
                </button>
                <button className="hero-button add-row" onClick={addRow}>
                  Add Row
                </button>
              </>
            )}
          </div>

          {/* Pagination */}
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
