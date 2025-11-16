import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import { useStuntingSweeperBulananData } from "@/hooks/query/use-stuntingsweeper";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function DataStuntingBulan() {
  const { data: apiData, isLoading: isLoadingApiData } =
    useStuntingSweeperBulananData();
  const toNum = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  const years = Object.keys(apiData?.data ?? {}).map((y) => Number(y));
  const selectedYear = years.sort((a, b) => b - a)[0];
  interface MonthItem {
    tahun: number;
    bulan: number;
    nama_bulan: string;
    totalBalita: number | string;
    gizi_buruk: number | string;
    gizi_kurang: number | string;
    gizi_baik: number | string;
    gizi_lebih: number | string;
    obesitas: number | string;
    stunting: number | string;
    bb_kurang: number | string;
  }
  const months: MonthItem[] = (() => {
    const data = (apiData as unknown as { data?: Record<number, MonthItem[]> })
      ?.data?.[selectedYear];
    return Array.isArray(data) ? data : [];
  })();
  const monthsSorted = [...months].sort((a, b) => a.bulan - b.bulan);
  const totalBalitaYear = monthsSorted.reduce(
    (acc, m) => acc + toNum(m.totalBalita),
    0
  );

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan Penangan Stunting per Bulan"
        description={
          <>
            Last update: {apiData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : Stunting Sweeper)</span>
            <div className="mt-1 text-xs">Tahun: {selectedYear || "-"}</div>
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
                      getPatternByKey(String(selectedYear))
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                          Total Balita Tahun {selectedYear || "-"}
                        </div>
                        <div className="text-[10px] md:text-[11px] opacity-80">
                          Akumulasi per bulan
                        </div>
                      </div>
                      <div className="text-base md:text-lg font-bold tabular-nums">
                        {totalBalitaYear.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-full flex-1">
                  {monthsSorted.map((m) => (
                    <div
                      key={`${selectedYear}-${m.bulan}`}
                      className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex flex-col gap-2"
                    >
                      <ShineBorder
                        shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold">
                          {m.nama_bulan}
                          <div className="text-[10px] md:text-[11px] opacity-80">
                            Tahun {m.tahun}
                          </div>
                        </div>
                        <div className="text-xs font-bold tabular-nums">
                          {toNum(m.totalBalita).toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Gizi Buruk", value: toNum(m.gizi_buruk) },
                          { label: "Gizi Kurang", value: toNum(m.gizi_kurang) },
                          { label: "Gizi Baik", value: toNum(m.gizi_baik) },
                          { label: "Gizi Lebih", value: toNum(m.gizi_lebih) },
                          { label: "Obesitas", value: toNum(m.obesitas) },
                          { label: "Stunting", value: toNum(m.stunting) },
                          { label: "BB Kurang", value: toNum(m.bb_kurang) },
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
