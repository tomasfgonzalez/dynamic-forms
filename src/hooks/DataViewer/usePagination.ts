import { useState, useMemo, useEffect } from "react";
import type { Row, Schema } from "../../types/schema";

export function usePagination(
  rows: Row[],
  selectedSchema: Schema | null,
  rowsPerPage: number = 10 // static
) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // filter rows by search
  const matchesSearch = (row: Row, schema: Schema, q: string) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return schema.fields.some((f) => {
      if (f.type === "checkbox") return false;
      const value = row[f.name];
      return value !== undefined && value !== null && String(value).toLowerCase().includes(lower);
    });
  };

  const filteredRows = useMemo(() => {
    if (!selectedSchema) return [];
    return rows.filter((row) => matchesSearch(row, selectedSchema, search));
  }, [rows, selectedSchema, search]);

  // calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  }, [filteredRows.length, rowsPerPage]);

  // reset currentPage if filteredRows change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // slice rows for current page
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredRows.slice(start, end);
  }, [filteredRows, currentPage, rowsPerPage]);

  // navigate pages
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    search,
    setSearch,
    filteredRows,
    paginatedRows,
    currentPage,
    totalPages,
    goToPage,
  };
}

