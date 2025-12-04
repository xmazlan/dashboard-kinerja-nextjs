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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  jenis: z.string().min(1, "Pilih jenis"),
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
});

type FormValues = z.infer<typeof schema>;

export default function FormKinerja() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { jenis: "", file: undefined as unknown as File },
    mode: "onTouched",
  });

  const onSubmit = async (values: FormValues) => {
    toast.success("Data siap diunggah");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label>Jenis</Label>
          <FormField
            control={form.control}
            name="jenis"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realisasi">Realisasi</SelectItem>
                      <SelectItem value="rfk">RFK</SelectItem>
                      <SelectItem value="pajak">Pajak</SelectItem>
                    </SelectContent>
                  </Select>
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">Unggah</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
