"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface TahunOption {
  value: string | number;
  text: string | number;
}

interface Props {
  bulan: string;
  setBulan: (v: string) => void;
  tahun: string | number;
  setTahun: (v: string) => void;
  tahunOptions: TahunOption[];
  dirty: boolean;
  clearFilter: () => void;
}

export default function PajakFilterControls({
  bulan,
  setBulan,
  tahun,
  setTahun,
  tahunOptions,
  dirty,
  clearFilter,
}: Props) {
  return (
    <>
      <Select value={bulan} onValueChange={(v) => setBulan(v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih bulan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Januari</SelectItem>
          <SelectItem value="2">Februari</SelectItem>
          <SelectItem value="3">Maret</SelectItem>
          <SelectItem value="4">April</SelectItem>
          <SelectItem value="5">Mei</SelectItem>
          <SelectItem value="6">Juni</SelectItem>
          <SelectItem value="7">Juli</SelectItem>
          <SelectItem value="8">Agustus</SelectItem>
          <SelectItem value="9">September</SelectItem>
          <SelectItem value="10">Oktober</SelectItem>
          <SelectItem value="11">November</SelectItem>
          <SelectItem value="12">Desember</SelectItem>
        </SelectContent>
      </Select>
      <Select value={String(tahun)} onValueChange={(v) => setTahun(v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih tahun" />
        </SelectTrigger>
        <SelectContent>
          {tahunOptions.map((opt, idx) => (
            <SelectItem key={idx} value={String(opt.value)}>
              {String(opt.text)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {dirty && (
        <Button variant="outline" onClick={clearFilter}>
          Bersihkan
        </Button>
      )}
    </>
  );
}

