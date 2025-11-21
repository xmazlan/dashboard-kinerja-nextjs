"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";

import { NEUTRAL_PATTERN } from "@/components/patern-collor";
import { useBpkadSp2dData } from "@/hooks/query/use-bpkad";
import { Button } from "@/components/ui/button";
import { ModalDetail } from "@/components/modal/detail-modal";
import OPDProgressCard from "./opd-progress-card";

export default function DataBpkadSp2d() {
  const { data: apiData, isLoading: isLoadingMasterData } = useBpkadSp2dData();
  const [showAll, setShowAll] = React.useState(false);
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
            <div className="w-full sm:hidden">
              <ModalDetail
                title="Detail Layanan BPKAD SP2D"
                description="Tabulasi dan visualisasi detail."
                contentModal={
                  <div className="sm:hidden max-h-[65vh] overflow-y-auto space-y-2 pr-1">
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
        {isLoadingMasterData ? (
          <LoadingSkeleton rows={2} cols={3} />
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

            const sorted = [...list].sort(
              (a, b) => Number(b?.Persentase ?? 0) - Number(a?.Persentase ?? 0)
            );

            const cleanOPDName = (s: unknown) => {
              const str = String(s ?? "").trim();
              const match = str.match(/^[\d.]+\s+(.+)$/);
              return match ? match[1] : str;
            };

            return (
              <div className="h-full flex flex-col space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {summary.map((s, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-md p-4 text-white flex items-center justify-between h-full shadow-sm ring-1 ring-white/10",
                        s.bg || NEUTRAL_PATTERN
                      )}
                    >
                      <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                        {s.label}
                      </div>
                      <div className="text-xl md:text-2xl font-bold tracking-wide tabular-nums text-right">
                        <span suppressHydrationWarning>
                          {s.label === "Persentase"
                            ? `${Number(s.value).toFixed(2)}%`
                            : Number(s.value).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                      Menampilkan{" "}
                      <span suppressHydrationWarning>
                        {Math.min(6, sorted.length)}
                      </span>{" "}
                      dari <span suppressHydrationWarning>{sorted.length}</span>{" "}
                      OPD
                    </div>
                    {sorted.length > 6 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => setShowAll((v) => !v)}
                      >
                        {showAll ? (
                          "Tutup"
                        ) : (
                          <span suppressHydrationWarning>{`Lihat semua (${
                            sorted.length - 6
                          } lagi)`}</span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 h-full flex-1">
                  {(showAll ? sorted : sorted.slice(0, 6)).map((row, idx) => {
                    const p = Number(row?.Persentase ?? 0);
                    const real = Number(row?.Realisasi_OPD ?? 0);
                    const pagu = Number(row?.PaguAnggaran ?? 0);
                    return (
                      <OPDProgressCard
                        key={idx}
                        opdName={cleanOPDName(row?.OPD)}
                        percentage={p}
                        realisasi={real}
                        pagu={pagu}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
