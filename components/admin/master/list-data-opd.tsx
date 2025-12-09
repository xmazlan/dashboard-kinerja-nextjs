"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type OpdItem = {
  id: number;
  opd: string;
  opd_slug: string;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  items: OpdItem[];
  loading: boolean;
  onView: (item: OpdItem) => void;
  onEdit: (item: OpdItem) => void;
  onDelete: (item: OpdItem) => void;
  pageSize?: number;
};

export default function ListDataOpdTable({
  items,
  loading,
  onView,
  onEdit,
  onDelete,
  pageSize = 10,
}: Props) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);
  const paged = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);
  return (
    <div className="rounded-md border">
      <ScrollArea className="max-h-[420px]">
        <div className="min-w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/60 backdrop-blur supports-backdrop-filter:bg-muted/40 z-10">
              <TableRow>
                <TableHead className="w-[50%]">OPD</TableHead>
                <TableHead className="w-[30%]">Slug</TableHead>
                <TableHead className="w-[20%] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-[60%]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[40%]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.opd}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {it.opd_slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(it)}
                          aria-label="Lihat"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(it)}
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(it)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="text-sm text-muted-foreground">
          Total: {items.length}
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={page === idx + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(idx + 1);
                    }}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
