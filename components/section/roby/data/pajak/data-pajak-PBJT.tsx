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
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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

export default function DataPajakPBJT() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { data: jenisResp, isLoading: isLoadingJenis } = useJenisPajakData();
  const { data: tahunResp, isLoading: isLoadingTahun } = useTahunPajakData();
  const jenisOptions: Array<{ value: string | number; text: string }> =
    Array.isArray(jenisResp?.data) ? jenisResp.data : [];
  const tahunOptions: Array<{ value: string | number; text: string | number }> =
    Array.isArray(tahunResp?.data) ? tahunResp.data : [];
  const [jenispajak, setJenisPajak] = React.useState<string>("jMuzg");
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
        title="Statistik Pajak PBJT"
        description={
          <>
            <span className="italic text-xs">
              (Sumber : Pajak Statistik PBJT)
            </span>
          </>
        }
        action={
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
              title="Detail Pajak PBJT"
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
        <CardComponent>
          <div className="">
            <div className=" mx-auto space-y-3">
              {isLoadingJenis || isLoadingTahun || isLoadingStat ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-card rounded-xl p-4 border">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="bg-card rounded-xl p-4 border">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="bg-card rounded-xl p-4 border">
                      <Skeleton className="h-4 w-28 mb-4" />
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-card rounded-xl p-4 border">
                      <Skeleton className="h-5 w-56 mb-4" />
                      <Skeleton className="h-[220px] w-full" />
                    </div>
                    <div className="bg-card rounded-xl p-4 border lg:col-span-2">
                      <Skeleton className="h-5 w-64 mb-4" />
                      <Skeleton className="h-[220px] w-full" />
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 border">
                    <Skeleton className="h-4 w-40 mb-3" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-card rounded-xl shadow-lg p-4 border hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Total Target
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="text-xl font-bold text-foreground mb-1">
                        {formatCurrency(totalTarget)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Target tahun {tahun}
                      </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-lg p-4 border hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Total Realisasi
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          {isAboveTarget ? (
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-foreground mb-1">
                        {formatCurrency(totalRealisasi)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Realisasi tahun {tahun}
                      </div>
                    </div>

                    {/* <div className="bg-card rounded-xl shadow-lg p-4 border hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Persentase Capaian
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Minus className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="text-xl font-bold text-foreground mb-1">
                        {percentage.toFixed(2)}%
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {isAboveTarget
                          ? "Melebihi target"
                          : "Dari total target"}
                      </div>
                    </div> */}
                  </div>

                  {/* Main Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Pie Chart */}
                    <div className="bg-card rounded-xl shadow-lg p-4 border">
                      <h3 className="text-base font-semibold text-foreground mb-3 pb-2 border-b">
                        Distribusi Target
                      </h3>
                      {Array.isArray(pieData) && pieData.length > 0 && (
                        <div className="h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                dataKey="Target"
                                nameKey="Jenis"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                              >
                                {pieData.map((_, i) => {
                                  const palette = [
                                    "#3b82f6", // blue (Realisasi)
                                    "#f59e0b", // amber (Target)
                                  ];
                                  return (
                                    <Cell
                                      key={i}
                                      fill={palette[i % palette.length]}
                                    />
                                  );
                                })}
                              </Pie>
                              <Tooltip
                                formatter={defaultTooltipFormatter}
                                labelFormatter={defaultLabelFormatter}
                                contentStyle={{
                                  backgroundColor: isDark
                                    ? "#0f172a"
                                    : "#ffffff",
                                  borderColor: isDark ? "#1f2937" : "#e5e7eb",
                                }}
                                itemStyle={{
                                  color: isDark ? "#e5e7eb" : "#334155",
                                }}
                                labelStyle={{
                                  color: isDark ? "#e5e7eb" : "#334155",
                                }}
                              />
                              <Legend
                                wrapperStyle={{
                                  fontSize: "11px",
                                  paddingTop: "12px",
                                  color: isDark ? "#e5e7eb" : "#334155",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                      {Array.isArray(pieData) && pieData.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {pieData.map((it, idx) => {
                            const pct =
                              pieTotal > 0
                                ? (Number(it.Target || 0) / pieTotal) * 100
                                : 0;
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] text-muted-foreground"
                              >
                                <span className="truncate">{it.Jenis}</span>
                                <span className="font-mono">
                                  {formatCurrency(Number(it.Target || 0))}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Bar Chart Triwulan */}
                    <div className="bg-card rounded-xl shadow-lg p-4 border lg:col-span-2">
                      <h3 className="text-base font-semibold text-foreground mb-3 pb-2 border-b">
                        Perbandingan Target vs Realisasi per Triwulan
                      </h3>
                      {Array.isArray(triwulanData) &&
                        triwulanData.length > 0 && (
                          <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={triwulanData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke={isDark ? "#1f2937" : "#e5e7eb"}
                                />
                                <XAxis
                                  dataKey="tw"
                                  tickLine={false}
                                  axisLine={false}
                                  tick={{
                                    fontSize: 10,
                                    fill: isDark ? "#e5e7eb" : "#334155",
                                  }}
                                />
                                <Tooltip
                                  formatter={defaultTooltipFormatter}
                                  labelFormatter={defaultLabelFormatter}
                                  contentStyle={{
                                    backgroundColor: isDark
                                      ? "#0f172a"
                                      : "#ffffff",
                                    borderColor: isDark ? "#1f2937" : "#e5e7eb",
                                  }}
                                  itemStyle={{
                                    color: isDark ? "#e5e7eb" : "#334155",
                                  }}
                                  labelStyle={{
                                    color: isDark ? "#e5e7eb" : "#334155",
                                  }}
                                />
                                <Legend
                                  wrapperStyle={{
                                    fontSize: "11px",
                                    paddingTop: "12px",
                                    color: isDark ? "#e5e7eb" : "#334155",
                                  }}
                                />
                                <Bar
                                  dataKey="target"
                                  fill="#f59e0b"
                                  radius={[8, 8, 0, 0]}
                                  name="Target"
                                />
                                <Bar
                                  dataKey="total"
                                  fill="#3b82f6"
                                  radius={[8, 8, 0, 0]}
                                  name="Realisasi"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardComponent>
      </CardComponent>
    </>
  );
}
