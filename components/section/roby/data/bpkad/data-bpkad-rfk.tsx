"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";

import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
import { useBpkadRfkData } from "@/hooks/query/use-bpkad";
import { Button } from "@/components/ui/button";

export default function DataBpkadRfk() {
  const { data: masterData, isLoading: isLoadingMasterData } =
    useBpkadRfkData();
  const [showAll, setShowAll] = React.useState(false);

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
        // action={
        //   <ModalDetail
        //     title="Detail Layanan BPKAD"
        //     description="Ringkasan dan detail per kategori. Gulir untuk melihat semua informasi."
        //     contentModal={
        //       <Tabs defaultValue="all" className="flex flex-col gap-3">
        //         <TabsList>
        //           <TabsTrigger value="all">Ringkasan</TabsTrigger>
        //           <TabsTrigger value="opd">OPD</TabsTrigger>
        //           <TabsTrigger value="kecamatan">Kecamatan</TabsTrigger>
        //           <TabsTrigger value="kelurahan">Kelurahan</TabsTrigger>
        //         </TabsList>
        //         <div className="h-[60vh] overflow-y-auto rounded-md border">
        //           <TabsContent value="all" className="p-3">
        //             <DataEresponAll />
        //           </TabsContent>
        //           <TabsContent value="kecamatan" className="p-3">
        //             <DataEresponKecamatan />
        //           </TabsContent>
        //           <TabsContent value="kelurahan" className="p-3">
        //             <DataEresponKelurahan />
        //           </TabsContent>
        //           <TabsContent value="opd" className="p-3">
        //             <DataEresponOpd />
        //           </TabsContent>
        //         </div>
        //       </Tabs>
        //     }
        //   />
        // }
      >
        {isLoadingMasterData ? (
          <LoadingSkeleton rows={2} cols={3} />
        ) : (
          (() => {
            const rekap = masterData?.data?.Rekap_Kota ?? {};
            const persenKeu = Number(rekap?.persen_keu ?? 0);
            const persenFisik = Number(rekap?.persen_fisik ?? 0);
            const list = Array.isArray(masterData?.data?.data)
              ? (masterData?.data?.data as Array<any>)
              : [];

            const TILE_COLOR = "bg-blue-700";
            const pctClass = (_p: number) => TILE_COLOR;

            const summary = [
              {
                label: "Keuangan",
                value: `${persenKeu.toFixed(2)}%`,
                bg: "bg-emerald-600",
              },
              {
                label: "Fisik",
                value: `${persenFisik.toFixed(2)}%`,
                bg: "bg-indigo-700",
              },
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
                        <span suppressHydrationWarning>{s.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {Math.min(6, sorted.length)} dari{" "}
                    {sorted.length} OPD
                  </div>
                  {sorted.length > 6 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => setShowAll((v) => !v)}
                    >
                      {showAll
                        ? "Tutup"
                        : `Lihat semua (${sorted.length - 6} lagi)`}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 h-full flex-1">
                  {(showAll ? sorted : sorted.slice(0, 6)).map((row, idx) => {
                    const uang = Number(row?.PER_UANG ?? 0);
                    const fisik = Number(row?.PER_FISIK ?? 0);
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-4 text-white h-full shadow-sm ring-1 ring-white/10",
                          pctClass(0)
                        )}
                        title={String(row?.OPD || "-")}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90 min-w-0 truncate">
                            {cleanOPDName(row?.OPD)}
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] font-bold tabular-nums">
                              <span suppressHydrationWarning>
                                {uang.toFixed(2)}% Keu
                              </span>
                            </div>
                            <div className="text-[11px] font-bold tabular-nums">
                              <span suppressHydrationWarning>
                                {fisik.toFixed(2)}% Fisik
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="h-2 w-full rounded bg-white/20 overflow-hidden">
                            <div
                              className="h-full rounded bg-white/80"
                              style={{
                                width: `${Math.min(100, Math.max(0, uang))}%`,
                              }}
                            />
                          </div>
                          <div className="h-2 w-full rounded bg-white/20 overflow-hidden">
                            <div
                              className="h-full rounded bg-white/80"
                              style={{
                                width: `${Math.min(100, Math.max(0, fisik))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
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
