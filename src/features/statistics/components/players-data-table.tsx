"use client";

import { Table } from "@/components/foundation/table/table";
import { TableBody } from "@/components/foundation/table/table-body";
import { TableCell } from "@/components/foundation/table/table-cell";
import { TableHead } from "@/components/foundation/table/table-head";
import { TableHeader } from "@/components/foundation/table/table-header";
import { TableRow } from "@/components/foundation/table/table-row";
import { cn } from "@/utils/tw-merge";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoveDown, MoveUp } from "lucide-react";
import { useState } from "react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function PlayerAverageDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex w-full flex-col justify-center rounded-lg border border-gray-800 text-white">
      <Table className="scrollbar-none overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-gray-800 p-2 hover:bg-gray-800/50"
            >
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();

                return (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      isSortable ? "cursor-pointer select-none" : "",
                      "cursor-pointer p-2 font-semibold text-gray-300 hover:bg-gray-800/30",
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {sortDirection === "asc" ? (
                        <MoveUp className="h-3 w-2 text-orange-300" />
                      ) : sortDirection === "desc" ? (
                        <MoveDown className="h-3 w-2 text-orange-300" />
                      ) : (
                        <ArrowUpDown className="h-2 w-2" />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-gray-800 transition-colors hover:bg-gray-800/30"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-4 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
