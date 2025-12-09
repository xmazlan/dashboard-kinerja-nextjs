"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export type ApplicationFormValues = {
  nama_aplikasi: string;
  master_opd_id: string;
  deskripsi?: string;
};

export default function FormApplication({
  form,
  loading,
  opdOptions,
}: {
  form: UseFormReturn<ApplicationFormValues>;
  loading: boolean;
  opdOptions: Array<{ id: number; opd: string }>;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="nama_aplikasi"
          render={({ field }) => (
            <FormItem>
              <Label>Nama Aplikasi</Label>
              <FormControl>
                <Input
                  placeholder="Contoh: SAKIP"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="master_opd_id"
          render={({ field }) => (
            <FormItem>
              <Label>OPD</Label>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="— Pilih OPD —" />
                  </SelectTrigger>
                  <SelectContent>
                    {opdOptions.map((opt) => (
                      <SelectItem key={opt.id} value={String(opt.id)}>
                        {opt.opd}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <Label>Deskripsi</Label>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Opsional"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
