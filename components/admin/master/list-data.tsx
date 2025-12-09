"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
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

export default function ListDataOpd({
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
          <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b bg-muted/40">
            <div className="col-span-4 text-xs font-medium">OPD</div>
            <div className="col-span-3 text-xs font-medium">Slug</div>
            <div className="col-span-3 text-xs font-medium">Dibuat</div>
            <div className="col-span-2 text-xs font-medium text-right">
              Aksi
            </div>
          </div>
          {loading ? (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Memuat...
            </div>
          ) : items.length === 0 ? (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Tidak ada data
            </div>
          ) : (
            paged.map((it) => (
              <div
                key={it.id}
                className="grid grid-cols-12 gap-2 px-3 py-2 border-b"
              >
                <div className="col-span-4 text-sm font-medium">{it.opd}</div>
                <div className="col-span-3 text-sm text-muted-foreground">
                  {it.opd_slug}
                </div>
                <div className="col-span-3 text-xs text-muted-foreground">
                  {String(it.created_at || "-")}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(it)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(it)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(it)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="text-sm text-muted-foreground">
          Total: {items.length}
        </div>
        <div className="">
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
