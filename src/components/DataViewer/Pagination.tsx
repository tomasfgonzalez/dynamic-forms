import React from "react";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, goToPage }: PaginationProps) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="pagination-container">
      <button
        className="btn normal"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!canPrev}
      >
        Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="btn normal"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!canNext}
      >
        Next
      </button>
    </div>
  );
}
