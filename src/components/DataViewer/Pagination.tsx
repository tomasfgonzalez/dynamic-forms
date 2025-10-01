// src/components/formPageComponents/Pagination.tsx
import React from "react";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, goToPage }: PaginationProps) {
  return (
    <div className="pagination-container">
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        Prev
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}
