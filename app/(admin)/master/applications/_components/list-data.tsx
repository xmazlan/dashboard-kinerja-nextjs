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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormModal from "@/components/modal/form-modal";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import ListDataApplicationTable from "@/components/admin/master/list-data-application";
import FormApplication from "./form-application";
import type { ApplicationFormValues } from "./form-application";
import type { ApplicationItem } from "@/components/admin/master/list-data-application";
import { useMasterOpdList } from "@/hooks/query/use-master-opd-list";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const schema = z.object({
  nama_aplikasi: z
    .string()
    .min(2, "Minimal 2 karakter")
    .max(100, "Maksimal 100 karakter"),
  master_opd_id: z.string().min(1, "Wajib pilih OPD"),
  deskripsi: z.string().max(255, "Maksimal 255 karakter").optional(),
});

type ApplicationListProps = {
  items: ApplicationItem[];
  loading: boolean;
  onCreate: (data: {
    nama_aplikasi: string;
    master_opd_id: string;
    deskripsi?: string | null;
  }) => Promise<void> | void;
  onUpdate: (
    id: number,
    data: {
      nama_aplikasi: string;
      master_opd_id: string;
      deskripsi?: string | null;
    }
  ) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  onView?: (item: ApplicationItem) => void;
  pageSize?: number;
};

export default function ListDataApplication({
  items,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  onView,
  pageSize = 5,
}: ApplicationListProps) {
  const rows: ApplicationItem[] = Array.isArray(items) ? items : [];
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selected, setSelected] = React.useState<ApplicationItem | null>(null);
  const { data: opdList } = useMasterOpdList();
  const opdOptions: Array<{ id: number; opd: string }> = Array.isArray(
    opdList?.data
  )
    ? (opdList!.data as Array<{ id: number; opd: string }>)
    : [];
  const formCreate = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nama_aplikasi: "", master_opd_id: "", deskripsi: "" },
    mode: "onTouched",
  });
  const formEdit = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nama_aplikasi: "", master_opd_id: "", deskripsi: "" },
    mode: "onTouched",
  });

  const handleCreate = async (values: z.infer<typeof schema>) => {
    try {
      await onCreate({
        nama_aplikasi: values.nama_aplikasi,
        master_opd_id: values.master_opd_id,
        deskripsi: values.deskripsi,
      });
      toast.success("Berhasil menambah Aplikasi");
      setOpenCreate(false);
      formCreate.reset({ nama_aplikasi: "", master_opd_id: "", deskripsi: "" });
    } catch (e) {
      const detail = (() => {
        const err = e as unknown;
        const r = err as Record<string, unknown>;
        const resp = r["response"] as Record<string, unknown> | undefined;
        const respData = resp?.["data"] as unknown;
        const data = respData ?? r["data"] ?? err;
        try {
          return JSON.stringify(data, null, 2).slice(0, 2000);
        } catch {
          return String(data);
        }
      })();
      toast.error("Gagal menambah Aplikasi", { description: detail });
    }
  };

  const handleEdit = async (values: z.infer<typeof schema>) => {
    if (!selected) return;
    try {
      await onUpdate(selected.id, {
        nama_aplikasi: values.nama_aplikasi,
        master_opd_id: values.master_opd_id,
        deskripsi: values.deskripsi,
      });
      toast.success("Berhasil mengubah Aplikasi");
      setOpenEdit(false);
    } catch (e) {
      const detail = (() => {
        const err = e as unknown;
        const r = err as Record<string, unknown>;
        const resp = r["response"] as Record<string, unknown> | undefined;
        const respData = resp?.["data"] as unknown;
        const data = respData ?? r["data"] ?? err;
        try {
          return JSON.stringify(data, null, 2).slice(0, 2000);
        } catch {
          return String(data);
        }
      })();
      toast.error("Gagal mengubah Aplikasi", { description: detail });
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await onDelete(selected.id);
      toast.success("Berhasil menghapus Aplikasi");
      setOpenDelete(false);
      setSelected(null);
    } catch (e) {
      const detail = (() => {
        const err = e as unknown;
        const r = err as Record<string, unknown>;
        const resp = r["response"] as Record<string, unknown> | undefined;
        const respData = resp?.["data"] as unknown;
        const data = respData ?? r["data"] ?? err;
        try {
          return JSON.stringify(data, null, 2).slice(0, 2000);
        } catch {
          return String(data);
        }
      })();
      toast.error("Gagal menghapus Aplikasi", { description: detail });
    }
  };

  const handleOpenEdit = (item: ApplicationItem) => {
    setSelected(item);
    const selectedOpdId = opdOptions.find(
      (opt) => opt.opd === String(item.opd || "")
    )?.id;
    formEdit.reset({
      nama_aplikasi: item.nama_aplikasi,
      master_opd_id: selectedOpdId ? String(selectedOpdId) : "",
      deskripsi: String(item.deskripsi ?? ""),
    });
    setOpenEdit(true);
  };

  const handleOpenView = async (item: ApplicationItem) => {
    setSelected(item);
    setOpenView(true);
  };

  const handleOpenDelete = (item: ApplicationItem) => {
    setSelected(item);
    setOpenDelete(true);
  };

  const [search, setSearch] = React.useState("");
  const [selectedOpd, setSelectedOpd] = React.useState("");
  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch = s
        ? r.nama_aplikasi.toLowerCase().includes(s) ||
          String(r.opd || "")
            .toLowerCase()
            .includes(s) ||
          (r.deskripsi ? String(r.deskripsi).toLowerCase().includes(s) : false)
        : true;
      const matchesOpd = selectedOpd
        ? String(r.opd || "") === selectedOpd
        : true;
      return matchesSearch && matchesOpd;
    });
  }, [rows, search, selectedOpd]);

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
          <div className="w-85 flex items-center gap-2">
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
          <Plus className="w-4 h-4 mr-2" /> Tambah Aplikasi
        </Button>
        <FormModal
          className="sm:max-w-xl"
          isOpen={openCreate}
          onOpenChange={setOpenCreate}
          title="Tambah Aplikasi"
          description="Masukkan data aplikasi"
          formId="application-create-form"
          submitLabel="Simpan"
          cancelLabel="Batal"
          content={
            <Form {...formCreate}>
              <form
                id="application-create-form"
                onSubmit={formCreate.handleSubmit(handleCreate)}
                className="space-y-4"
              >
                <FormApplication
                  form={formCreate}
                  loading={loading}
                  opdOptions={opdOptions}
                />
              </form>
            </Form>
          }
        />
      </div>

      <ListDataApplicationTable
        items={filtered}
        loading={loading}
        onView={(it) => handleOpenView(it)}
        onEdit={(it) => handleOpenEdit(it)}
        onDelete={(it) => handleOpenDelete(it)}
        pageSize={pageSize}
      />

      <FormModal
        className="sm:max-w-xl"
        isOpen={openEdit}
        onOpenChange={setOpenEdit}
        title="Edit Aplikasi"
        description="Perbarui data aplikasi"
        formId="application-edit-form"
        submitLabel="Simpan"
        cancelLabel="Batal"
        content={
          <Form {...formEdit}>
            <form
              id="application-edit-form"
              onSubmit={formEdit.handleSubmit(handleEdit)}
              className="space-y-4"
            >
              <FormApplication
                form={formEdit}
                loading={loading}
                opdOptions={opdOptions}
              />
            </form>
          </Form>
        }
      />

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Aplikasi</DialogTitle>
            <DialogDescription>Informasi Aplikasi</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">ID:</span> {selected?.id}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Nama Aplikasi:</span>{" "}
              {selected?.nama_aplikasi}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">OPD:</span>{" "}
              {selected?.opd}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Deskripsi:</span>{" "}
              {String(selected?.deskripsi ?? "-")}
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
            <span className="font-medium">{selected?.nama_aplikasi}</span>
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
