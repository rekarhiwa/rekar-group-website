"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  searchValue?: (row: T) => string;
}

export function DataTable<T extends { id?: string }>({
  title,
  rows,
  columns,
  filters = [],
  className,
}: {
  title?: string;
  rows: T[];
  columns: Column<T>[];
  filters?: { label: string; value: string; predicate: (row: T) => boolean }[];
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(filters[0]?.value ?? "all");

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        !query ||
        columns.some((column) =>
          (column.searchValue?.(row) ?? "").toLowerCase().includes(query.toLowerCase())
        );
      const filter = filters.find((item) => item.value === activeFilter);
      const matchesFilter = !filter || filter.predicate(row);
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, columns, filters, query, rows]);

  return (
    <div className={cn("rounded-3xl border border-white/10 bg-white/[0.03]", className)}>
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          {title ? <h3 className="font-semibold text-white">{title}</h3> : null}
          <p className="text-sm text-muted">{filteredRows.length} بڕگە</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="گەڕان..."
            className="min-w-[220px] border-white/10 bg-[#1b0826]"
          />
          {filters.length ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  activeFilter === "all"
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/10 text-muted"
                )}
              >
                هەموو
              </button>
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition",
                    activeFilter === filter.value
                      ? "border-primary bg-primary/20 text-white"
                      : "border-white/10 text-muted"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-muted">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={row.id ?? index} className="border-b border-white/5 align-top">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-foreground">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {!filteredRows.length ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  هیچ بڕگەیەک نەدۆزرایەوە.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
