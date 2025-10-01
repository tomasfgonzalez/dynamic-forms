// src/components/DataViewerComponents/TableNavigation.tsx
import React from "react";

export interface TableNavigationProps {
  colStart: number;
  setColStart: React.Dispatch<React.SetStateAction<number>>;
  totalCols: number;
  colsPerPage: number;
}

const TableNavigation: React.FC<TableNavigationProps> = ({
  colStart,
  setColStart,
  totalCols,
  colsPerPage,
}) => {
  const canPrev = colStart > 0;
  const canNext = colStart + colsPerPage < totalCols;

  const handlePrev = () => setColStart(Math.max(colStart - colsPerPage, 0));
  const handleNext = () =>
    setColStart(Math.min(colStart + colsPerPage, totalCols - colsPerPage));

  return (
    <div className="table-nav">
      <button disabled={!canPrev} onClick={handlePrev}>
        ◀
      </button>
      <span>
        Columns {colStart + 1}–{Math.min(colStart + colsPerPage, totalCols)} of{" "}
        {totalCols}
      </span>
      <button disabled={!canNext} onClick={handleNext}>
        ▶
      </button>
    </div>
  );
};

export default TableNavigation;
