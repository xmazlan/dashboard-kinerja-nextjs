"use client";
import React from "react";
import FormKinerja from "@/components/admin/form-kinerja";
import { Card } from "@/components/ui/card";

export default function VPageFormKinerja() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-background" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/30" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-900/30" />
      </div>
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Unggah Data Kinerja
          </h1>
          <p className="text-sm text-muted-foreground">
            Pilih jenis dan unggah berkas .xlsx maksimal 2MB
          </p>
        </div>
        <Card className="p-6">
          <FormKinerja />
        </Card>
      </div>
    </section>
  );
}
