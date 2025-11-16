import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import { useStuntingSweeperKelurahanData } from "@/hooks/query/use-stuntingsweeper";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function DataStuntingKelurahan() {
  const { data: apiData, isLoading: isLoadingApiData } =
    useStuntingSweeperKelurahanData();
  const toNum = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  interface KelurahanItem {
    nama: string;
    totalBalita: number | string;
    gizi_buruk: number | string;
    gizi_kurang: number | string;
    gizi_baik: number | string;
    gizi_lebih: number | string;
    obesitas: number | string;
    stunting: number | string;
    bb_kurang: number | string;
  }
  const items: KelurahanItem[] = (() => {
    const data = (apiData as unknown as { data?: KelurahanItem[] })?.data;
    return Array.isArray(data) ? data : [];
  })();
  const itemsSorted = [...items].sort(
    (a, b) => toNum(b.totalBalita) - toNum(a.totalBalita)
  );
  const totalBalitaAll = itemsSorted.reduce(
    (acc, it) => acc + toNum(it.totalBalita),
    0
  );

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan Penangan Stunting per Kelurahan"
        description={
          <>
            Last update: {apiData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : Stunting Sweeper)</span>
            <div className="mt-1 text-xs">Kelurahan: {itemsSorted.length}</div>
          </>
        }
      >
        {isLoadingApiData ? (
          <LoadingSkeleton rows={2} cols={4} />
        ) : (
          (() => {
            return (
              <div className="h-full flex flex-col space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-full flex-1">
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("Total Balita Kecamatan")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                          Total Balita (Semua Kelurahan)
                        </div>
                        <div className="text-[10px] md:text-[11px] opacity-80">
                          Akumulasi ke semua kelurahan
                        </div>
                      </div>
                      <div className="text-base md:text-lg font-bold tabular-nums">
                        {totalBalitaAll.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-full flex-1">
                  {itemsSorted.map((it, idx) => (
                    <div
                      key={`${it.nama}-${idx}`}
                      className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex flex-col gap-2"
                    >
                      <ShineBorder
                        shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold">{it.nama}</div>
                        <div className="text-xs font-bold tabular-nums">
                          {toNum(it.totalBalita).toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Gizi Buruk", value: toNum(it.gizi_buruk) },
                          {
                            label: "Gizi Kurang",
                            value: toNum(it.gizi_kurang),
                          },
                          { label: "Gizi Baik", value: toNum(it.gizi_baik) },
                          { label: "Gizi Lebih", value: toNum(it.gizi_lebih) },
                          { label: "Obesitas", value: toNum(it.obesitas) },
                          { label: "Stunting", value: toNum(it.stunting) },
                          { label: "BB Kurang", value: toNum(it.bb_kurang) },
                        ].map((e) => (
                          <div
                            key={e.label}
                            className={cn(
                              "rounded-lg p-2 border flex items-center justify-between text-white",
                              getPatternByKey(e.label)
                            )}
                          >
                            <div
                              className="text-[12px] font-medium truncate"
                              title={e.label}
                            >
                              {e.label}
                            </div>
                            <div className="text-[12px] font-mono font-semibold tabular-nums">
                              {e.value.toLocaleString("id-ID")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
