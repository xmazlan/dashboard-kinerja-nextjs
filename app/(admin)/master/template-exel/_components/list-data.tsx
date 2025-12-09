"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FormModal from "./form-modal";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import ListDataTemplateTable from "@/components/admin/master/list-data-template-exel";
import type { ExcelTemplateItem } from "@/components/admin/master/list-data-template-exel";
import { useMasterOpdList } from "@/hooks/query/use-master-opd-list";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FormTemplate from "./form-template";

type ApplicationListProps = {
  items: ExcelTemplateItem[];
  loading: boolean;
  onDelete: (id: number) => Promise<void> | void;
  onView?: (item: ExcelTemplateItem) => void;
  pageSize?: number;
};

export default function ListDataTemplateExcel({
  items,
  loading,
  onDelete,
  pageSize = 5,
}: ApplicationListProps) {
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selected, setSelected] = React.useState<ExcelTemplateItem | null>(
    null
  );
  const { data: opdList } = useMasterOpdList();
  const opdOptions: Array<{ id: number; opd: string }> = Array.isArray(
    opdList?.data
  )
    ? (opdList!.data as Array<{ id: number; opd: string }>)
    : [];

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await onDelete(selected.id);
      toast.success("Berhasil menghapus Aplikasi");
      setOpenDelete(false);
      setSelected(null);
    } catch {
      toast.error("Gagal menghapus Aplikasi");
    }
  };

  const handleOpenEdit = (item: ExcelTemplateItem) => {
    setSelected(item);
    setOpenEdit(true);
  };

  const handleOpenView = async (item: ExcelTemplateItem) => {
    setSelected(item);
    setOpenView(true);
  };

  const handleOpenDelete = (item: ExcelTemplateItem) => {
    setSelected(item);
    setOpenDelete(true);
  };

  const [search, setSearch] = React.useState("");
  const [selectedOpd, setSelectedOpd] = React.useState("");
  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    const rows: ExcelTemplateItem[] = Array.isArray(items) ? items : [];
    return rows.filter((r) => {
      const matchesSearch = s
        ? r.aplikasi.toLowerCase().includes(s) ||
          String(r.opd || "")
            .toLowerCase()
            .includes(s) ||
          false
        : true;
      const matchesOpd = selectedOpd
        ? String(r.opd || "") === selectedOpd
        : true;
      return matchesSearch && matchesOpd;
    });
  }, [items, search, selectedOpd]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="max-w-xs w-full">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Cari aplikasi..."
            />
          </div>
          <div className="w-[340px] flex items-center gap-2">
            <div className="flex-1">
              <Select
                value={selectedOpd}
                onValueChange={(v) => setSelectedOpd(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Semua OPD" />
                </SelectTrigger>
                <SelectContent>
                  {opdOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.opd}>
                      {opt.opd}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedOpd ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOpd("")}
              >
                Reset
              </Button>
            ) : null}
          </div>
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Template Excel
        </Button>
        <FormModal
          className="sm|max-w-xl"
          isOpen={openCreate}
          onOpenChange={setOpenCreate}
          title="Tambah Template Excel"
          description="Unggah file template .xlsx"
          formId="excel-opd-create-form"
          content={
            <FormTemplate
              mode="create"
              open={openCreate}
              onSuccess={() => setOpenCreate(false)}
            />
          }
        />
      </div>

      <ListDataTemplateTable
        items={filtered}
        loading={loading}
        onView={(it) => handleOpenView(it)}
        onEdit={(it) => handleOpenEdit(it)}
        onDelete={(it) => handleOpenDelete(it)}
        pageSize={pageSize}
      />

      <FormModal
        className="sm|max-w-xl"
        isOpen={openEdit}
        onOpenChange={setOpenEdit}
        title="Edit Template Excel"
        description="Perbarui data template atau unggah ulang file"
        formId="application-edit-form"
        content={
          <FormTemplate
            mode="update"
            dataID={String(selected?.id)}
            open={openEdit}
            onSuccess={() => setOpenEdit(false)}
          />
        }
      />

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Template Excel</DialogTitle>
            <DialogDescription>Informasi Template Excel</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">ID:</span> {selected?.id}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">OPD:</span>{" "}
              {selected?.opd}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Aplikasi:</span>{" "}
              {selected?.aplikasi}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">File:</span>{" "}
              {selected?.file ? (
                <a
                  href={selected.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {selected.file}
                </a>
              ) : (
                "-"
              )}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Dibuat:</span>{" "}
              {String(selected?.created_at || "-")}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Diubah:</span>{" "}
              {String(selected?.updated_at || "-")}
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpenView(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Aplikasi</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm">
            Anda akan menghapus:{" "}
            <span className="font-medium">
              {selected?.aplikasi} - {selected?.opd}
            </span>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
