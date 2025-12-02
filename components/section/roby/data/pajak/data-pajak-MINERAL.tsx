"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePajakStatistikData,
  useJenisPajakData,
  useTahunPajakData,
} from "@/hooks/query/use-pajak";
import { ModalDetail } from "@/components/modal/detail-modal";
import DataDetailPajak from "./data-detail-pajak";
import CardComponent from "@/components/card/card-component";
import { Button } from "@/components/ui/button";
import { usePajakFilterStore } from "@/store/use-pajak-filter";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import PajakFilterControls from "./pajak-filter-controls";
import PajakStatistikContent from "./pajak-statistik-content";

export default function DataPajakMINERAL() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { data: jenisResp, isLoading: isLoadingJenis } = useJenisPajakData();
  const { data: tahunResp, isLoading: isLoadingTahun } = useTahunPajakData();
  const jenisOptions: Array<{ value: string | number; text: string }> =
    Array.isArray(jenisResp?.data) ? jenisResp.data : [];
  const tahunOptions: Array<{ value: string | number; text: string | number }> =
    Array.isArray(tahunResp?.data) ? tahunResp.data : [];
  const [jenispajak, setJenisPajak] = React.useState<string>("suzM");
  const bulan = usePajakFilterStore((s) => s.bulan);
  const tahun = usePajakFilterStore((s) => s.tahun);
  const setBulan = usePajakFilterStore((s) => s.setBulan);
  const setTahun = usePajakFilterStore((s) => s.setTahun);
  const clearFilter = usePajakFilterStore((s) => s.clearFilter);
  const dirty = usePajakFilterStore((s) => s.dirty);
  React.useEffect(() => {
    if (!jenispajak && jenisOptions.length > 0)
      setJenisPajak(String(jenisOptions[0].value));
  }, [jenispajak, jenisOptions]);
  // Default bulan/tahun berasal dari store (persisted). Tidak auto-set dari opsi API.
  const { data: apiResp, isLoading: isLoadingStat } = usePajakStatistikData({
    jenispajak,
    bulan,
    tahun,
  });

  const dt = apiResp?.data ?? {};
  type TriwulanItem = { tw: string | number; target: number; total: number };
  // type TahunItem = { tahun: number; total: number };
  type BulanItem = { tanggal: number | string; total: number };
  type PieItem = { Jenis: string; Target: number };

  const pieData: PieItem[] = Array.isArray(dt?.pieTahun?.data)
    ? (dt.pieTahun.data as PieItem[])
    : [];
  const pieTotal = pieData.reduce(
    (a: number, b: PieItem) => a + Number(b?.Target || 0),
    0
  );
  const triwulanData: TriwulanItem[] = Array.isArray(dt?.perTriwulan?.data)
    ? (dt.perTriwulan.data as TriwulanItem[])
    : [];
  // perTahunData tersedia dari API, tidak digunakan di tampilan ini
  const perBulanData: BulanItem[] = Array.isArray(dt?.perBulan?.data)
    ? (dt.perBulan.data as BulanItem[])
    : [];

  // Calculate summary statistics
  const totalTarget = triwulanData.reduce(
    (a: number, b: TriwulanItem) => a + Number(b?.target || 0),
    0
  );
  const totalRealisasi = triwulanData.reduce(
    (a: number, b: TriwulanItem) => a + Number(b?.total || 0),
    0
  );
  const percentage = totalTarget > 0 ? (totalRealisasi / totalTarget) * 100 : 0;
  const isAboveTarget = totalRealisasi > totalTarget;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const monthLabel = monthNames[Number(bulan) - 1] ?? "";

  const defaultTooltipFormatter = (value: unknown) =>
    typeof value === "number"
      ? formatCurrency(value)
      : formatCurrency(Number(value));
  const defaultLabelFormatter = (label: unknown) => String(label ?? "");
  const dailyLabelFormatter = (label: unknown) => {
    if (typeof label === "number") return `${label} ${monthLabel} ${tahun}`;
    const d = new Date(String(label));
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Statistik Pajak MINERAL"
        description={
          <>
            <span className="italic text-xs">
              (Sumber : Pajak Statistik MINERAL)
            </span>
          </>
        }
        action={
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            {/* <Select value={jenispajak} onValueChange={(v) => setJenisPajak(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Jenis pajak" />
              </SelectTrigger>
              <SelectContent>
                {jenisOptions.map((opt, idx) => (
                  <SelectItem key={idx} value={String(opt.value)}>
                    {opt.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <PajakFilterControls
              bulan={bulan}
              setBulan={setBulan}
              tahun={tahun}
              setTahun={setTahun}
              tahunOptions={tahunOptions}
              dirty={dirty}
              clearFilter={clearFilter}
            />
            <ModalDetail
              title="Detail Pajak MINERAL"
              description="Tabulasi dan visualisasi detail."
              contentModal={
                <DataDetailPajak
                  jenispajak={jenispajak}
                  bulan={bulan}
                  tahun={tahun}
                />
              }
            />
          </div>
        }
      >
        <PajakStatistikContent
          isLoading={isLoadingJenis || isLoadingTahun || isLoadingStat}
          isDark={isDark}
          tahun={tahun}
          totalTarget={totalTarget}
          totalRealisasi={totalRealisasi}
          isAboveTarget={isAboveTarget}
          pieData={pieData}
          pieTotal={pieTotal}
          triwulanData={triwulanData}
          formatCurrency={formatCurrency}
          defaultTooltipFormatter={defaultTooltipFormatter}
          defaultLabelFormatter={defaultLabelFormatter}
        />
      </CardComponent>
    </>
  );
}
