"use client";
import CardComponent from "@/components/card/card-component";

import {
  NEUTRAL_PATTERN,
  getGradientStyleByKey,
} from "@/components/patern-collor";
import { useBpkadSp2dData } from "@/hooks/query/use-bpkad";
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { pieChartOptions } from "@/lib/apex-chart-options";
import BarChart from "@/components/apexchart/bar-chart";
import { ShineBorder } from "@/components/magicui/shine-border";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ModalDetail } from "@/components/modal/detail-modal";
import OPDProgressCard from "./opd-progress-card";
import formatCurrency from "@/lib/format-currency";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";

export default function DataBpkadSp2d() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
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
            <LoadingContent />
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

            const pieLabels = pieData.map((d) => String(d.name));
            const pieSeries = pieData.map((d) => Number(d.value || 0));
            const pieOptions = merge(
              pieChartOptions(
                Boolean(isDark),
                "Proporsi Realisasi vs Pagu",
                `Periode ${periodeDisplay}`
              ),
              {
                labels: pieLabels,
                legend: { show: true },
                tooltip: {
                  y: {
                    formatter: (val: number) =>
                      `${formatCurrency(Number(val))}`,
                  },
                },
              }
            );

            return (
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="grid grid-cols-1 lg:col-span-2 gap-4">
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

                <LayoutCard
                  className="relative bg-card rounded-lg shadow-lg p-2 border lg:col-span-4"
                  ratioDesktop={0.5}
                  ratioMobile={0.38}
                >
                  <div className="flex h-full flex-col">
                    {pieData.length > 0 && (
                      <div className="flex-1 min-h-0 h-[clamp(240px,42vh,480px)]">
                        <BarChart
                          options={pieOptions}
                          series={pieSeries}
                          type="pie"
                          height="100%"
                        />
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
                </LayoutCard>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
