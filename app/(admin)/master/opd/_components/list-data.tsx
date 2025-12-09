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
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import FormModal from "@/components/modal/form-modal";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import ListData from "@/components/admin/master/list-data";

type OpdItem = {
  id: number;
  opd: string;
  opd_slug: string;
  created_at?: string;
  updated_at?: string;
};

const schema = z.object({
  opd: z
    .string()
    .min(2, "Minimal 2 karakter")
    .max(100, "Maksimal 100 karakter"),
});

type OpdListProps = {
  items: OpdItem[];
  loading: boolean;
  onCreate: (data: { opd: string }) => Promise<void> | void;
  onUpdate: (id: number, data: { opd: string }) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  onView?: (item: OpdItem) => void;
  pageSize?: number;
};

export default function ListDataOpd({
  items,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  onView,
  pageSize = 10,
}: OpdListProps) {
  const rows: OpdItem[] = Array.isArray(items) ? items : [];
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selected, setSelected] = React.useState<OpdItem | null>(null);

  const formCreate = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { opd: "" },
    mode: "onTouched",
  });
  const formEdit = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { opd: "" },
    mode: "onTouched",
  });

  const handleCreate = async (values: z.infer<typeof schema>) => {
    try {
      await onCreate({ opd: values.opd });
      toast.success("Berhasil menambah OPD");
      setOpenCreate(false);
      formCreate.reset({ opd: "" });
    } catch (e) {
      toast.error("Gagal menambah OPD");
    }
  };

  const handleEdit = async (values: z.infer<typeof schema>) => {
    if (!selected) return;
    try {
      await onUpdate(selected.id, { opd: values.opd });
      toast.success("Berhasil mengubah OPD");
      setOpenEdit(false);
    } catch {
      toast.error("Gagal mengubah OPD");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await onDelete(selected.id);
      toast.success("Berhasil menghapus OPD");
      setOpenDelete(false);
      setSelected(null);
    } catch {
      toast.error("Gagal menghapus OPD");
    }
  };

  const handleOpenEdit = (item: OpdItem) => {
    setSelected(item);
    formEdit.reset({ opd: item.opd });
    setOpenEdit(true);
  };

  const handleOpenView = async (item: OpdItem) => {
    setSelected(item);
    setOpenView(true);
  };

  const handleOpenDelete = (item: OpdItem) => {
    setSelected(item);
    setOpenDelete(true);
  };

  const [search, setSearch] = React.useState("");
  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    return s ? rows.filter((r) => r.opd.toLowerCase().includes(s)) : rows;
  }, [rows, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 max-w-xs">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Cari OPD..."
          />
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah OPD
        </Button>
        <FormModal
          isOpen={openCreate}
          onOpenChange={setOpenCreate}
          title="Tambah OPD"
          description="Masukkan nama OPD"
          formId="opd-create-form"
          submitLabel="Simpan"
          cancelLabel="Batal"
          content={
            <Form {...formCreate}>
              <form
                id="opd-create-form"
                onSubmit={formCreate.handleSubmit(handleCreate)}
                className="space-y-4"
              >
                <FormField
                  control={formCreate.control}
                  name="opd"
                  render={({ field }) => (
                    <FormItem>
                      <Label>OPD</Label>
                      <FormControl>
                        <Input placeholder="Contoh: DISDIK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          }
        />
      </div>

      <ListData
        items={filtered}
        loading={loading}
        onView={(it) => handleOpenView(it)}
        onEdit={(it) => handleOpenEdit(it)}
        onDelete={(it) => handleOpenDelete(it)}
        pageSize={pageSize}
      />

      <FormModal
        isOpen={openEdit}
        onOpenChange={setOpenEdit}
        title="Edit OPD"
        description="Perbarui nama OPD"
        formId="opd-edit-form"
        submitLabel="Simpan"
        cancelLabel="Batal"
        content={
          <Form {...formEdit}>
            <form
              id="opd-edit-form"
              onSubmit={formEdit.handleSubmit(handleEdit)}
              className="space-y-4"
            >
              <FormField
                control={formEdit.control}
                name="opd"
                render={({ field }) => (
                  <FormItem>
                    <Label>OPD</Label>
                    <FormControl>
                      <Input placeholder="Contoh: DISDIK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        }
      />

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail OPD</DialogTitle>
            <DialogDescription>Informasi OPD</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">ID:</span> {selected?.id}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Nama:</span>{" "}
              {selected?.opd}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Slug:</span>{" "}
              {selected?.opd_slug}
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
            <DialogTitle>Hapus OPD</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm">
            Anda akan menghapus:{" "}
            <span className="font-medium">{selected?.opd}</span>
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
