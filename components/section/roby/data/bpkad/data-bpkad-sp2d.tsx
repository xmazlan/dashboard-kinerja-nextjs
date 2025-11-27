"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";

import {
  NEUTRAL_PATTERN,
  getGradientStyleByKey,
} from "@/components/patern-collor";
import { useBpkadSp2dData } from "@/hooks/query/use-bpkad";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { ShineBorder } from "@/components/magicui/shine-border";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ModalDetail } from "@/components/modal/detail-modal";
import OPDProgressCard from "./opd-progress-card";
import formatCurrency from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function DataBpkadSp2d() {
  const {
    data: apiData,
    isLoading: isLoadingMasterData,
    isFetching: isFetchingMasterData,
  } = useBpkadSp2dData();
  const masterData = apiData;

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan BPKAD SP2D"
        description={(() => {
          const periode = String(masterData?.data?.Rekap_Kota?.Periode || "-");
          const last = String(masterData?.last_get || "");
          return (
            <>
              Last update: <span suppressHydrationWarning>{last || "-"}</span>
              <br />
              Periode: <span suppressHydrationWarning>{periode || "-"}</span>
              <br />
              <span className="italic text-xs">(Sumber : BPKAD)</span>
            </>
          );
        })()}
        action={(() => {
          type Row = {
            Persentase?: number | string;
            Realisasi_OPD?: number | string;
            PaguAnggaran?: number | string;
            OPD?: unknown;
          };
          const list: Row[] = Array.isArray(masterData?.data?.data)
            ? (masterData?.data?.data as Row[])
            : [];
          return (
            <div className="w-full">
              <ModalDetail
                title="Detail Layanan BPKAD SP2D"
                description="Tabulasi dan visualisasi detail."
                contentModal={
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-[65vh] overflow-y-auto space-y-2 pr-2">
                    {list.map((row, idx) => {
                      const p = Number(row?.Persentase ?? 0);
                      const real = Number(row?.Realisasi_OPD ?? 0);
                      const pagu = Number(row?.PaguAnggaran ?? 0);
                      const opdName = String(row?.OPD ?? "-");
                      const clean = (() => {
                        const str = opdName.trim();
                        const match = str.match(/^[\d.]+\s+(.+)$/);
                        return match ? match[1] : str;
                      })();
                      return (
                        <OPDProgressCard
                          key={idx}
                          opdName={clean}
                          percentage={p}
                          realisasi={real}
                          pagu={pagu}
                        />
                      );
                    })}
                  </div>
                }
              />
            </div>
          );
        })()}
      >
        {isLoadingMasterData || isFetchingMasterData ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
              <div className="grid grid-cols-1 lg:col-span-1 gap-2">
                <div className="bg-card rounded-lg p-3 border">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-36 mb-1.5" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="bg-card rounded-lg p-3 border">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-36 mb-1.5" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-3 border lg:col-span-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-[160px] w-full" />
                <div className="mt-2 space-y-1">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          </>
        ) : (
          (() => {
            const rekap = masterData?.data?.Rekap_Kota ?? {};
            const jumlahRealisasi = Number(rekap?.Jumlah_Realisasi ?? 0);
            const jumlahPagu = Number(rekap?.Jumlah_Pagu ?? 0);
            const persentase = Number(rekap?.Persentase ?? 0);
            type Row = {
              Persentase?: number | string;
              Realisasi_OPD?: number | string;
              PaguAnggaran?: number | string;
              OPD?: unknown;
            };
            const list: Row[] = Array.isArray(masterData?.data?.data)
              ? (masterData?.data?.data as Row[])
              : [];

            const summary = [
              {
                label: "Jumlah Realisasi",
                value: jumlahRealisasi,
                bg: "bg-emerald-600",
              },
              { label: "Jumlah Pagu", value: jumlahPagu, bg: "bg-indigo-700" },
              { label: "Persentase", value: persentase, bg: "bg-orange-600" },
            ];

            const cleanOPDName = (s: unknown) => {
              const str = String(s ?? "").trim();
              const match = str.match(/^[\d.]+\s+(.+)$/);
              return match ? match[1] : str;
            };

            const pieData = [
              { name: "Jumlah Realisasi", value: jumlahRealisasi },
              { name: "Jumlah Pagu", value: jumlahPagu },
            ];
            const totalPie = jumlahRealisasi + jumlahPagu;
            const periodeDisplay = String(rekap?.Periode ?? "-");
            const isAboveTarget = jumlahRealisasi >= jumlahPagu;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
                <div className="grid grid-cols-1 lg:col-span-2 gap-2">
                  <div
                    className="rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-target")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/90">
                        Total Pagu
                      </span>
                      <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="text-md font-bold text-white mb-1">
                      {formatCurrency(jumlahPagu)}
                    </div>
                    <div className="text-[11px] text-white/80">
                      Periode {periodeDisplay}
                    </div>
                  </div>

                  <div
                    className="rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-realisasi")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/90">
                        Total Realisasi
                      </span>
                      <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        {isAboveTarget ? (
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="text-md font-bold text-white mb-1">
                      {formatCurrency(jumlahRealisasi)}
                    </div>
                    <div className="text-[11px] text-white/80">
                      Periode {periodeDisplay}
                    </div>
                  </div>
                </div>

                <div className="relative bg-card rounded-md shadow-sm lg:col-span-4 p-2 border">
                  <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />
                  <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                    Proporsi Realisasi vs Pagu
                  </h3>
                  {pieData.length > 0 && (
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                          >
                            {pieData.map((_, i) => {
                              const palette = [
                                "#3b82f6",
                                "#f59e0b",
                                "#10b981",
                                "#8b5cf6",
                                "#ef4444",
                                "#14b8a6",
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
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              borderColor: "#e5e7eb",
                            }}
                            itemStyle={{ color: "#334155" }}
                            labelStyle={{ color: "#334155" }}
                          />
                          <Legend
                            wrapperStyle={{
                              fontSize: "11px",
                              paddingTop: "12px",
                              color: "#334155",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {pieData.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      {pieData.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[10px] text-muted-foreground"
                        >
                          <span className="truncate">{it.name}</span>
                          <span className="font-mono">
                            {`${formatCurrency(it.value)} (${
                              totalPie > 0
                                ? ((it.value / totalPie) * 100).toFixed(2)
                                : "0.00"
                            } %)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
