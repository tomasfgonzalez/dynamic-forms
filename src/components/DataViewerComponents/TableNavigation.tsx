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

  return (
    <div className="table-nav">
      <button disabled={!canPrev} onClick={() => setColStart(colStart - 1)}>
        ◀
      </button>
      <button disabled={!canNext} onClick={() => setColStart(colStart + 1)}>
        ▶
      </button>
    </div>
  );
};

export default TableNavigation;
