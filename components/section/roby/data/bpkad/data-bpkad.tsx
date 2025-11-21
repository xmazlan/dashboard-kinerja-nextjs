import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import {
  Building2,
  Tags,
  ShieldCheck,
  MapPin,
  MessageSquare,
  AlertCircle,
  Loader2,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataEresponAll from "@/components/section/roby/data/pengaduan/data-erespon-all";
import DataEresponKecamatan from "@/components/section/roby/data/pengaduan/data-erespon-kecamatan";
import DataEresponKelurahan from "@/components/section/roby/data/pengaduan/data-erespon-kelurahan";
import DataEresponOpd from "@/components/section/roby/data/pengaduan/data-erespon-opd";
import { useBpkadSp2dData } from "@/hooks/query/use-bpkad";
import { Button } from "@/components/ui/button";

export default function DataBpkad() {
  const { data: masterData, isLoading: isLoadingMasterData } =
    useBpkadSp2dData();
  const [showAll, setShowAll] = React.useState(false);

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan BPKAD"
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
        action={
          <ModalDetail
            title="Detail Layanan BPKAD"
            description="Ringkasan dan detail per kategori. Gulir untuk melihat semua informasi."
            contentModal={
              <Tabs defaultValue="all" className="flex flex-col gap-3">
                <TabsList>
                  <TabsTrigger value="all">Ringkasan</TabsTrigger>
                  <TabsTrigger value="opd">OPD</TabsTrigger>
                  <TabsTrigger value="kecamatan">Kecamatan</TabsTrigger>
                  <TabsTrigger value="kelurahan">Kelurahan</TabsTrigger>
                </TabsList>
                <div className="h-[60vh] overflow-y-auto rounded-md border">
                  <TabsContent value="all" className="p-3">
                    <DataEresponAll />
                  </TabsContent>
                  <TabsContent value="kecamatan" className="p-3">
                    <DataEresponKecamatan />
                  </TabsContent>
                  <TabsContent value="kelurahan" className="p-3">
                    <DataEresponKelurahan />
                  </TabsContent>
                  <TabsContent value="opd" className="p-3">
                    <DataEresponOpd />
                  </TabsContent>
                </div>
              </Tabs>
            }
          />
        }
      >
        {isLoadingMasterData ? (
          <LoadingSkeleton rows={2} cols={3} />
        ) : (
          (() => {
            const rekap = masterData?.data?.Rekap_Kota ?? {};
            const jumlahRealisasi = Number(rekap?.Jumlah_Realisasi ?? 0);
            const jumlahPagu = Number(rekap?.Jumlah_Pagu ?? 0);
            const persentase = Number(rekap?.Persentase ?? 0);
            const list = Array.isArray(masterData?.data?.data)
              ? (masterData?.data?.data as Array<any>)
              : [];

            const TILE_COLOR = "bg-blue-700";
            const pctClass = (_p: number) => TILE_COLOR;

            const summary = [
              {
                label: "Jumlah Realisasi",
                value: jumlahRealisasi,
                bg: TILE_COLOR,
              },
              { label: "Jumlah Pagu", value: jumlahPagu, bg: TILE_COLOR },
              { label: "Persentase", value: persentase, bg: TILE_COLOR },
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
                        {s.label === "Persentase"
                          ? `${Number(s.value).toFixed(2)}%`
                          : Number(s.value).toLocaleString("id-ID")}
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
                    const p = Number(row?.Persentase ?? 0);
                    const real = Number(row?.Realisasi_OPD ?? 0);
                    const pagu = Number(row?.PaguAnggaran ?? 0);
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-4 text-white h-full shadow-sm ring-1 ring-white/10",
                          pctClass(p)
                        )}
                        title={String(row?.OPD || "-")}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90 min-w-0 truncate">
                            {cleanOPDName(row?.OPD)}
                          </div>
                          <span className="text-sm font-bold tabular-nums">
                            {p.toFixed(2)}%
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
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="rounded-md p-2 bg-white/10">
                            <div className="text-[10px] uppercase opacity-90">
                              Realisasi
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                              {real.toLocaleString("id-ID")}
                            </div>
                          </div>
                          <div className="rounded-md p-2 bg-white/10">
                            <div className="text-[10px] uppercase opacity-90">
                              Pagu
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                              {pagu.toLocaleString("id-ID")}
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
