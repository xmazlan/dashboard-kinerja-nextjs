"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type JsonTableProps = {
  data: any;
};

export default function JsonTable({ data }: JsonTableProps) {
  if (!data) return null;

  let source = data as any;
  if (
    source &&
    typeof source === "object" &&
    "data" in source &&
    Array.isArray((source as any).data)
  ) {
    source = (source as any).data;
  }

  const rows = Array.isArray(source) ? source : [source];
  if (!rows.length) return null;

  const objectRows = rows.filter(
    (row) => row && typeof row === "object" && !Array.isArray(row)
  ) as Record<string, any>[];

  if (!objectRows.length) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((value, index) => (
            <TableRow key={index}>
              <TableCell>
                {value == null
                  ? "-"
                  : typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  const columnSet = objectRows.reduce<Set<string>>((set, row) => {
    Object.keys(row || {}).forEach((key) => set.add(key));
    return set;
  }, new Set<string>());

  const columns = Array.from(columnSet);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {objectRows.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => {
              const value = row?.[column];
              const displayValue =
                value == null
                  ? "-"
                  : typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value);
              return <TableCell key={column}>{displayValue}</TableCell>;
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
