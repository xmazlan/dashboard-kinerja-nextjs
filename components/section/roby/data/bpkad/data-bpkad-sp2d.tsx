"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";

import { NEUTRAL_PATTERN } from "@/components/patern-collor";
import { useBpkadSp2dData } from "@/hooks/query/use-bpkad";
import { Button } from "@/components/ui/button";

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

            const TILE_COLOR = "bg-blue-700";
            const pctClass = () => TILE_COLOR;

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

                <div className="flex items-center justify-between">
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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 h-full flex-1">
                  {(showAll ? sorted : sorted.slice(0, 6)).map((row, idx) => {
                    const p = Number(row?.Persentase ?? 0);
                    const real = Number(row?.Realisasi_OPD ?? 0);
                    const pagu = Number(row?.PaguAnggaran ?? 0);
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-4 text-white h-full shadow-sm ring-1 ring-white/10",
                          pctClass()
                        )}
                        title={String(row?.OPD || "-")}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90 min-w-0 truncate">
                            {cleanOPDName(row?.OPD)}
                          </div>
                          <span className="text-sm font-bold tabular-nums">
                            <span suppressHydrationWarning>
                              {p.toFixed(2)}%
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded bg-white/20 overflow-hidden">
                          <div
                            className="h-full rounded bg-white/80"
                            style={{
                              width: `${Math.min(100, Math.max(0, p))}%`,
                            }}
                          />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-md p-2 bg-white/10">
                            <div className="text-[10px] uppercase opacity-90">
                              Realisasi
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                              <span suppressHydrationWarning>
                                {real.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md p-2 bg-white/10">
                            <div className="text-[10px] uppercase opacity-90">
                              Pagu
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                              <span suppressHydrationWarning>
                                {pagu.toLocaleString("id-ID")}
                              </span>
                            </div>
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
