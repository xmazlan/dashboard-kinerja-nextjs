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
import { Form } from "@/components/ui/form";
import FormModal from "@/components/modal/form-modal";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useMasterOpdList } from "@/hooks/query/use-master-opd-list";
import FormUser from "./form-user";
import type { UserFormValues } from "./form-user";
import ListDataUsersTable from "@/components/admin/master/list-data-users";

type UserItem = {
  id: number;
  name: string;
  email: string;
  role: string;
  opd?: string | null;
  opd_nama?: string | null;
  created_at?: string;
  updated_at?: string;
};

const createSchema = z
  .object({
    name: z
      .string()
      .min(2, "Minimal 2 karakter")
      .max(100, "Maksimal 100 karakter"),
    email: z.string().email("Email tidak valid"),
    role: z
      .string()
      .min(2, "Minimal 2 karakter")
      .max(20, "Maksimal 20 karakter"),
    opd_id: z.string().min(1, "Wajib pilih OPD"),
    password: z.string().min(6, "Minimal 6 karakter"),
    password_confirmation: z.string().min(6, "Minimal 6 karakter"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Konfirmasi password tidak sama",
  });

const updateSchema = z
  .object({
    name: z
      .string()
      .min(2, "Minimal 2 karakter")
      .max(100, "Maksimal 100 karakter"),
    email: z.string().email("Email tidak valid"),
    role: z
      .string()
      .min(2, "Minimal 2 karakter")
      .max(20, "Maksimal 20 karakter"),
    opd_id: z.string().min(1, "Wajib pilih OPD"),
    password: z.string(),
    password_confirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    const pwd = String(data.password ?? "").trim();
    const confirm = String(data.password_confirmation ?? "").trim();
    if (pwd.length > 0) {
      if (pwd.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Minimal 6 karakter",
        });
      }
      if (confirm.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password_confirmation"],
          message: "Konfirmasi password wajib diisi",
        });
      } else if (pwd !== confirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password_confirmation"],
          message: "Konfirmasi password tidak sama",
        });
      }
    }
  });

type UsersListProps = {
  items: UserItem[];
  loading: boolean;
  onCreate: (data: {
    name: string;
    email: string;
    role: string;
    opd_id: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void> | void;
  onUpdate: (
    id: number,
    data: {
      name: string;
      email: string;
      role: string;
      opd_id: string;
      password?: string;
      password_confirmation?: string;
    }
  ) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  pageSize?: number;
};

export default function ListDataUsers({
  items,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  pageSize = 5,
}: UsersListProps) {
  const rows: UserItem[] = Array.isArray(items) ? items : [];
  const { data: opdList } = useMasterOpdList();
  const opdOptions: Array<{ id: number; opd: string }> = Array.isArray(
    opdList?.data
  )
    ? (opdList!.data as Array<{ id: number; opd: string }>)
    : [];
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selected, setSelected] = React.useState<UserItem | null>(null);

  const formCreate = useForm<UserFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "opd",
      opd_id: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onTouched",
  });
  const formEdit = useForm<UserFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "opd",
      opd_id: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onTouched",
  });

  const handleCreate = async (values: UserFormValues) => {
    try {
      await onCreate({
        name: values.name,
        email: values.email,
        role: values.role,
        opd_id: values.opd_id,
        password: values.password!,
        password_confirmation: values.password_confirmation!,
      });
      toast.success("Berhasil menambah pengguna");
      setOpenCreate(false);
      formCreate.reset({
        name: "",
        email: "",
        role: "opd",
        opd_id: "",
        password: "",
        password_confirmation: "",
      });
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
      toast.error("Gagal menambah pengguna", { description: detail });
    }
  };

  const handleEdit = async (values: UserFormValues) => {
    if (!selected) return;
    try {
      const payload: {
        name: string;
        email: string;
        role: string;
        opd_id: string;
        password?: string;
        password_confirmation?: string;
      } = {
        name: values.name,
        email: values.email,
        role: values.role,
        opd_id: values.opd_id,
      };
      const pwd = String(values.password ?? "").trim();
      const confirm = String(values.password_confirmation ?? "").trim();
      if (pwd.length > 0) {
        payload.password = pwd;
        payload.password_confirmation = confirm;
      }
      await onUpdate(selected.id, payload);
      toast.success("Berhasil mengubah pengguna");
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
      toast.error("Gagal mengubah pengguna", { description: detail });
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await onDelete(selected.id);
      toast.success("Berhasil menghapus pengguna");
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
      toast.error("Gagal menghapus pengguna", { description: detail });
    }
  };

  const handleOpenEdit = (item: UserItem) => {
    setSelected(item);
    formEdit.reset({
      name: item.name,
      email: item.email,
      role: item.role,
      opd_id: String(item.opd ?? ""),
      password: "",
      password_confirmation: "",
    });
    setOpenEdit(true);
  };

  const handleOpenView = async (item: UserItem) => {
    setSelected(item);
    setOpenView(true);
  };

  const handleOpenDelete = (item: UserItem) => {
    setSelected(item);
    setOpenDelete(true);
  };

  const [search, setSearch] = React.useState("");
  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    const baseRows = Array.isArray(items) ? items : [];
    return s
      ? baseRows.filter(
          (r) =>
            r.name.toLowerCase().includes(s) ||
            r.email.toLowerCase().includes(s) ||
            (r.opd_nama ? r.opd_nama.toLowerCase().includes(s) : false)
        )
      : baseRows;
  }, [items, search]);

  // pagination handled inside ListDataUsersTable

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 max-w-xs">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Cari pengguna..."
          />
        </div>
        <Button size="sm" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Pengguna
        </Button>
        <FormModal
          className="sm:max-w-7xl"
          isOpen={openCreate}
          onOpenChange={setOpenCreate}
          title="Tambah Pengguna"
          description="Masukkan data pengguna"
          formId="user-create-form"
          submitLabel="Simpan"
          cancelLabel="Batal"
          content={
            <Form {...formCreate}>
              <form
                id="user-create-form"
                onSubmit={formCreate.handleSubmit(handleCreate)}
                className="space-y-4"
              >
                <FormUser
                  form={formCreate}
                  loading={loading}
                  opdOptions={opdOptions}
                  mode="store"
                />
              </form>
            </Form>
          }
        />
      </div>

      <ListDataUsersTable
        items={filtered}
        loading={loading}
        onView={(it) => handleOpenView(it)}
        onEdit={(it) => handleOpenEdit(it)}
        onDelete={(it) => handleOpenDelete(it)}
        pageSize={pageSize}
      />

      <FormModal
        className="sm:max-w-7xl"
        isOpen={openEdit}
        onOpenChange={setOpenEdit}
        title="Edit Pengguna"
        description="Perbarui data pengguna"
        formId="user-edit-form"
        submitLabel="Simpan"
        cancelLabel="Batal"
        content={
          <Form {...formEdit}>
            <form
              id="user-edit-form"
              onSubmit={formEdit.handleSubmit(handleEdit)}
              className="space-y-4"
            >
              <FormUser
                form={formEdit}
                loading={loading}
                opdOptions={opdOptions}
                mode="update"
              />
            </form>
          </Form>
        }
      />

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>Informasi pengguna</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">ID:</span> {selected?.id}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Nama:</span>{" "}
              {selected?.name}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Email:</span>{" "}
              {selected?.email}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Role:</span>{" "}
              {selected?.role}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">OPD:</span>{" "}
              {String(selected?.opd_nama ?? "-")}
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
            <DialogTitle>Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm">
            Anda akan menghapus:{" "}
            <span className="font-medium">{selected?.name}</span>
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
