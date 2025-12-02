"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";

import {
  getPatternByKey,
  NEUTRAL_PATTERN,
  getGradientStyleByKey,
} from "@/components/patern-collor";
import { useBpkadRfkData } from "@/hooks/query/use-bpkad";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { pieChartOptions } from "@/lib/apex-chart-options";
import BarChart from "@/components/apexchart/bar-chart";
import { ShineBorder } from "@/components/magicui/shine-border";
import { TrendingUp, TrendingDown } from "lucide-react";
import OPDProgressCard from "./opd-progress-card";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Input } from "@/components/ui/input";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";

export default function DataBpkadRfk() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const [tanggal, setTanggal] = React.useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const { data: masterData, isLoading: isLoadingMasterData } = useBpkadRfkData({
    tanggal,
  });

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan BPKAD (RFK)"
        description={(() => {
          const tanggal = String(masterData?.data?.Rekap_Kota?.Tanggal || "-");
          const last = String(masterData?.last_get || "");
          return (
            <>
              Last update: <span suppressHydrationWarning>{last || "-"}</span>
              <br />
              Tanggal: <span suppressHydrationWarning>{tanggal || "-"}</span>
              <br />
              <span className="italic text-xs">(Sumber : BPKAD)</span>
            </>
          );
        })()}
        action={(() => {
          type Row = {
            PER_UANG?: number | string;
            PER_FISIK?: number | string;
            OPD?: unknown;
          };
          const list: Row[] = Array.isArray(masterData?.data?.data)
            ? (masterData?.data?.data as Row[])
            : [];
          return (
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-[160px]"
                />
              </div>
              <ModalDetail
                title="Detail Layanan BPKAD RFK"
                description={`Detail layanan BPKAD RFK pada tanggal ${tanggal}`}
                contentModal={
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-[65vh] overflow-y-auto space-y-2 pr-2">
                    {list.map((row, idx) => {
                      const uang = Number(row?.PER_UANG ?? 0);
                      const fisik = Number(row?.PER_FISIK ?? 0);
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
                          percentage={uang}
                          realisasi={uang}
                          pagu={fisik}
                          leftLabel="Uang"
                          rightLabel="Fisik"
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
        {isLoadingMasterData ? (
          <>
            <LoadingContent />
          </>
        ) : (
          (() => {
            const rekap = masterData?.data?.Rekap_Kota ?? {};
            const persenKeu = Number(rekap?.persen_keu ?? 0);
            const persenFisik = Number(rekap?.persen_fisik ?? 0);
            const list = Array.isArray(masterData?.data?.data)
              ? (masterData?.data?.data as Array<any>)
              : [];

            const pieData = [
              { name: "Keuangan", value: persenKeu },
              { name: "Fisik", value: persenFisik },
            ];
            const totalPie = persenKeu + persenFisik;
            const isKeuUp = persenKeu >= persenFisik;
            const tanggalDisplay = String(rekap?.Tanggal ?? "-");

            const pieLabels = pieData.map((d) => String(d.name));
            const pieSeries = pieData.map((d) => Number(d.value || 0));
            const pieOptions = merge(
              pieChartOptions(
                Boolean(isDark),
                "Proporsi Keuangan vs Fisik",
                `Tanggal ${tanggalDisplay}`
              ),
              {
                labels: pieLabels,
                legend: { show: true },
                tooltip: {
                  y: {
                    formatter: (val: number) => `${Number(val).toFixed(2)}%`,
                  },
                },
              }
            );

            return (
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
                <div className="grid grid-cols-1 lg:col-span-2 gap-2">
                  <div
                    className="rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-target")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/90">
                        Keuangan
                      </span>
                      <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        {isKeuUp ? (
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="text-md font-bold text-white mb-1">
                      <span suppressHydrationWarning>{`${persenKeu.toFixed(
                        2
                      )}%`}</span>
                    </div>
                    <div className="text-[11px] text-white/80">
                      Tanggal {tanggalDisplay}
                    </div>
                  </div>

                  <div
                    className="rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-realisasi")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/90">
                        Fisik
                      </span>
                      <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        {persenFisik >= persenKeu ? (
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="text-md font-bold text-white mb-1">
                      <span suppressHydrationWarning>{`${persenFisik.toFixed(
                        2
                      )}%`}</span>
                    </div>
                    <div className="text-[11px] text-white/80">
                      Tanggal {tanggalDisplay}
                    </div>
                  </div>
                </div>

                <LayoutCard
                  className="relative bg-card rounded-lg shadow-lg p-2 border lg:col-span-4"
                  ratioDesktop={0.5}
                  ratioMobile={0.38}
                >
                  <div className="flex h-full flex-col">
                    <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                      Proporsi Keuangan vs Fisik
                    </h3>
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
                              {`${it.value.toFixed(2)}% (${
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
