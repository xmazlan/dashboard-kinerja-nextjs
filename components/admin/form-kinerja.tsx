"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useAplikasiOpdData } from "@/hooks/query/use-aplikasi-opd";
import { useSession } from "next-auth/react";

import DebugForm from "../debug-form";
import { useRouter } from "next/navigation";

const schema = z.object({
  opd: z.string().min(1, "OPD wajib diisi"),
  aplikasi: z.string().min(1, "Aplikasi wajib diisi"),
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
  jenis: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
const urlAPI = process.env.NEXT_PUBLIC_API_URL;
export default function FormKinerja() {
  const { data: session } = useSession();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      opd: session?.data?.user?.opd_slug || "",
      aplikasi: "",
      file: undefined as unknown as File,
    },
    mode: "onTouched",
  });
  const router = useRouter();
  const { data: aplikasiData, isLoading: isLoadingAplikasiData } =
    useAplikasiOpdData();
  const aplikasiOptions: Array<{
    id?: number;
    nama_aplikasi?: string;
    slug_aplikasi?: string;
  }> = Array.isArray(aplikasiData?.data) ? aplikasiData?.data : [];
  const [openCombobox, setOpenCombobox] = React.useState(false);

  React.useEffect(() => {
    const slug = session?.data?.user?.opd_slug;
    if (slug && !form.getValues("opd")) {
      form.setValue("opd", slug, { shouldValidate: true });
    }
  }, [session, form]);

  const onSubmit = async (values: FormValues) => {
    if (!urlAPI) {
      toast.error("API URL tidak tersedia");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("opd", session?.data?.user?.opd_slug || "");
      formData.append("aplikasi", values.aplikasi);

      const res = await fetch(`${urlAPI}/api/v1/import-excel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.data?.token}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => null as any);
      if (res.ok) {
        const msg = (data && data.message) || "Import berhasil!";
        toast.success(String(msg));
        form.reset({
          opd: session?.data?.user?.opd_slug || "",
          aplikasi: "",
          file: undefined as unknown as File,
        });
        form.setValue("file", undefined as unknown as File);
        router.push("/overview");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const msg = (data && data.message) || "Gagal mengunggah data";
        toast.error(String(msg));
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  return (
    <>
      {/* <DebugForm form={form} /> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Aplikasi</Label>
            <FormField
              control={form.control}
              name="aplikasi"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className="w-full justify-between"
                          disabled={isLoadingAplikasiData}
                        >
                          {(() => {
                            const cur = aplikasiOptions.find(
                              (opt) =>
                                String(opt.slug_aplikasi || "") ===
                                String(field.value || "")
                            );
                            return cur?.nama_aplikasi
                              ? String(cur.nama_aplikasi)
                              : isLoadingAplikasiData
                              ? "Memuat daftar aplikasi..."
                              : "Pilih aplikasi";
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
                                  value={String(opt.slug_aplikasi || "")}
                                  onSelect={(currentValue) => {
                                    const next =
                                      currentValue === field.value
                                        ? ""
                                        : currentValue;
                                    field.onChange(next);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  {String(opt.nama_aplikasi || "-")}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      String(field.value || "") ===
                                        String(opt.slug_aplikasi || "")
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Unggah</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                form.setValue("file", undefined as unknown as File);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
