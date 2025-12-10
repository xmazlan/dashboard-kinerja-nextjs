"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useMasterOpdList } from "@/hooks/query/use-master-opd-list";
import { useMasterApplicationOpdList } from "@/hooks/query/use-master-application-list";
import { Textarea } from "@/components/ui/textarea";
import DebugForm from "@/components/debug-form";
import DebugData from "@/components/debug-data";

const schemaCreate = z.object({
  opd_id: z.string().regex(/^\d+$/, "OPD wajib dipilih"),
  aplikasi_id: z.string().regex(/^\d+$/, "Aplikasi wajib dipilih"),
  file: z
    .custom<File>((val) => val instanceof File, { message: "File wajib diisi" })
    .refine((file) => !!file && file.size <= 2 * 1024 * 1024, {
      message: "Maksimal 2MB",
    })
    .refine(
      (file) =>
        !!file &&
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "Hanya .xlsx" }
    ),
  keterangan: z.string().max(255, "Maksimal 255 karakter").optional(),
});

const schemaUpdate = z.object({
  opd_id: z.string().regex(/^\d+$/, "OPD wajib dipilih"),
  aplikasi_id: z.string().regex(/^\d+$/, "Aplikasi wajib dipilih"),
  file: z
    .custom<File | undefined>((val) => !val || val instanceof File, {
      message: "File tidak valid",
    })
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "Maksimal 2MB",
    })
    .refine(
      (file) =>
        !file ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "Hanya .xlsx" }
    )
    .optional(),
  keterangan: z.string().max(255, "Maksimal 255 karakter").optional(),
});

type FormValues = {
  opd_id: string;
  aplikasi_id: string;
  file?: File;
  keterangan?: string;
};
const urlAPI = process.env.NEXT_PUBLIC_API_URL;
export default function FormTemplate({
  mode = "create",
  dataID = "",
  open,
  onSuccess,
}: {
  dataID?: string;
  mode?: "create" | "update";
  open?: boolean;
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(mode === "update" ? schemaUpdate : schemaCreate),
    defaultValues: {
      opd_id: "",
      aplikasi_id: "",
      file: undefined,
      keterangan: "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });
  const { data: opdList } = useMasterOpdList();
  const opdOptions: Array<{ id: number; opd: string }> = Array.isArray(
    opdList?.data
  )
    ? (opdList!.data as Array<{ id: number; opd: string }>)
    : [];
  const opdIdField = form.watch("opd_id");
  const opdIdNum = (() => {
    const n = Number(String(opdIdField || "").trim());
    return Number.isFinite(n) && n > 0 ? n : 0;
  })();
  const { data: applicationByOpd, isLoading: isLoadingApplicationByOpd } =
    useMasterApplicationOpdList(opdIdNum);
  const aplikasiOptions: Array<{ id: number; nama_aplikasi: string }> =
    Array.isArray(applicationByOpd?.data)
      ? (
          applicationByOpd!.data as Array<{
            id: number;
            nama_aplikasi: string;
          }>
        ).map((d) => ({ id: d.id, nama_aplikasi: d.nama_aplikasi }))
      : [];
  React.useEffect(() => {
    const cur = form.getValues("aplikasi_id");
    if (!opdIdNum && cur) form.setValue("aplikasi_id", "");
  }, [opdIdNum, form]);
  const [openComboboxOpd, setOpenComboboxOpd] = React.useState(false);
  const [openComboboxAplikasi, setOpenComboboxAplikasi] = React.useState(false);
  const submitting = form.formState.isSubmitting;
  const [reviewUrl, setReviewUrl] = React.useState<string>("");

  React.useEffect(() => {}, [session]);

  const onSubmit = async (values: FormValues) => {
    if (!urlAPI) {
      toast.error("API URL tidak tersedia");
      return;
    }
    try {
      const formData = new FormData();
      if (values.file instanceof File) {
        formData.append("file", values.file);
      }
      formData.append("opd_id", values.opd_id);
      formData.append("aplikasi_id", values.aplikasi_id);
      if (values.keterangan) formData.append("keterangan", values.keterangan);

      const url =
        mode === "update" && dataID
          ? `${urlAPI}/api/v1/master/excel-opd/${dataID}`
          : `${urlAPI}/api/v1/master/excel-opd`;
      const method = mode === "update" && dataID ? "POST" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session?.data?.token}`,
        },
        body: formData,
      });
      let data: { message?: string; errors?: Record<string, unknown> } | null =
        null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (res.ok) {
        const msg = (data && data.message) || "Import berhasil!";
        toast.success(String(msg));
        form.reset({
          opd_id: "",
          aplikasi_id: "",
          file: undefined as unknown as File,
          keterangan: "",
        });
        form.setValue("file", undefined as unknown as File);
        queryClient.invalidateQueries({
          queryKey: ["master-excel-opd-list", session?.data?.token],
        });
        onSuccess?.();
      } else {
        const msg = (data && data.message) || "Gagal mengunggah data";
        const detail = data
          ? (() => {
              try {
                return JSON.stringify(data, null, 2).slice(0, 2000);
              } catch {
                return String(data);
              }
            })()
          : `${res.status} ${res.statusText}`;
        if (data?.errors && typeof data.errors === "object") {
          const keys = ["opd_id", "aplikasi_id", "file"] as const;
          keys.forEach((k) => {
            const v = data?.errors
              ? (data.errors as Record<string, unknown>)[k]
              : undefined;
            const arr = Array.isArray(v) ? v : v ? [v] : [];
            const m = arr.length ? String(arr[0]) : "";
            if (m)
              form.setError(k as keyof FormValues, {
                type: "server",
                message: m,
              });
          });
        }
        toast.error(String(msg), { description: detail });
      }
    } catch (err) {
      const d =
        err instanceof Error ? err.message : typeof err === "string" ? err : "";
      toast.error("Terjadi kesalahan jaringan", { description: d });
    }
  };

  React.useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [form, form.formState.isSubmitSuccessful]);

  React.useEffect(() => {
    if (open === false) {
      form.setValue("file", undefined as unknown as File);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open, form]);

  React.useEffect(() => {
    const API = urlAPI;
    const token = session?.data?.token;
    const id = String(dataID || "").trim();
    const clean = (s: unknown) =>
      String(s ?? "")
        .replace(/`/g, "")
        .trim();
    const canFetch = mode === "update" && !!API && !!token && !!id && open;
    if (!canFetch) return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/v1/master/excel-opd/${id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        let payload: {
          data?: {
            opd_id?: number | string;
            aplikasi_id?: number | string;
            file?: string;
          };
        } | null = null;
        try {
          payload = await res.json();
        } catch {
          payload = null;
        }
        const dt = payload?.data;
        if (res.ok && dt) {
          if (dt.opd_id != null) form.setValue("opd_id", String(dt.opd_id));
          if (dt.aplikasi_id != null)
            form.setValue("aplikasi_id", String(dt.aplikasi_id));
          const url = clean(dt.file);
          setReviewUrl(url);
        } else if (!res.ok) {
          const detail = payload
            ? (() => {
                try {
                  return JSON.stringify(payload, null, 2).slice(0, 2000);
                } catch {
                  return String(payload);
                }
              })()
            : `${res.status} ${res.statusText}`;
          toast.error("Gagal memuat detail template", { description: detail });
        }
      } catch (err) {
        const d =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "";
        toast.error("Terjadi kesalahan jaringan", { description: d });
      }
    })();
  }, [mode, dataID, open, session?.data?.token, form]);

  return (
    <>
      {/* <DebugForm form={form} /> */}
      {/* <DebugData data={applicationByOpd} /> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="opd_id"
              render={({ field }) => (
                <FormItem>
                  <Label>OPD</Label>
                  <FormControl>
                    <Popover
                      open={openComboboxOpd}
                      onOpenChange={setOpenComboboxOpd}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openComboboxOpd}
                          className="w-full justify-between"
                          disabled={submitting}
                        >
                          {(() => {
                            const cur = opdOptions.find(
                              (opt) =>
                                String(opt.id) === String(field.value || "")
                            );
                            return cur?.opd ? String(cur.opd) : "— Pilih OPD —";
                          })()}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                        <Command>
                          <CommandInput
                            placeholder="Cari OPD..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Tidak ada OPD.</CommandEmpty>
                            <CommandGroup>
                              {opdOptions.map((opt, idx) => (
                                <CommandItem
                                  key={idx}
                                  value={String(opt.id)}
                                  onSelect={(currentValue) => {
                                    const next =
                                      currentValue === field.value
                                        ? ""
                                        : currentValue;
                                    field.onChange(next);
                                    setOpenComboboxOpd(false);
                                  }}
                                >
                                  {String(opt.opd || "-")}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      String(field.value || "") ===
                                        String(opt.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="aplikasi_id"
              render={({ field }) => (
                <FormItem>
                  <Label>Aplikasi</Label>
                  <FormControl>
                    <Popover
                      open={openComboboxAplikasi}
                      onOpenChange={setOpenComboboxAplikasi}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openComboboxAplikasi}
                          className="w-full justify-between"
                          disabled={submitting}
                        >
                          {(() => {
                            const cur = aplikasiOptions.find(
                              (opt) =>
                                String(opt.id) === String(field.value || "")
                            );
                            return cur?.nama_aplikasi
                              ? String(cur.nama_aplikasi)
                              : isLoadingApplicationByOpd
                              ? "Memuat daftar aplikasi..."
                              : opdIdNum
                              ? "— Pilih Aplikasi —"
                              : "Pilih OPD terlebih dahulu";
                          })()}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                        <Command>
                          <CommandInput
                            placeholder="Cari aplikasi..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Tidak ada aplikasi.</CommandEmpty>
                            <CommandGroup>
                              {aplikasiOptions.map((opt, idx) => (
                                <CommandItem
                                  key={idx}
                                  value={String(opt.id)}
                                  onSelect={(currentValue) => {
                                    const next =
                                      currentValue === field.value
                                        ? ""
                                        : currentValue;
                                    field.onChange(next);
                                    setOpenComboboxAplikasi(false);
                                  }}
                                >
                                  {String(opt.nama_aplikasi || "-")}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      String(field.value || "") ===
                                        String(opt.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>File .xlsx</Label>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      ref={fileInputRef}
                      disabled={submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="space-y-2">
            <Label>Keterangan</Label>
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Masukkan keterangan di sini"
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              {mode === "update" && reviewUrl ? (
                <div className="pt-2">
                  <a
                    href={reviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex"
                  >
                    <Button type="button" variant="secondary" size="sm">
                      Buka File
                    </Button>
                  </a>
                </div>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  form.setValue("file", undefined as unknown as File);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={submitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={submitting || !form.formState.isValid}
              >
                Simpan
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
