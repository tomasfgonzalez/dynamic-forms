import { useState, useMemo, useEffect } from "react";
import type { Row, Schema } from "../../types/schema";

export function usePagination(rows: Row[], selectedSchema: Schema | null, rowsPerPage = 20) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const matchesSearch = (row: Row, schema: Schema, q: string) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return schema.fields.some((f) => {
      if (f.type === "checkbox") return false;
      const value = row?.[f.name];
      return value !== undefined && value !== null && String(value).toLowerCase().includes(lower);
    });
  };

  const filteredRows = useMemo(() => {
    if (!selectedSchema) return [];
    return rows.filter((row) => matchesSearch(row, selectedSchema, search));
  }, [rows, selectedSchema, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [filteredRows, totalPages, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return { search, setSearch, filteredRows, currentPage, totalPages, goToPage };
}
