import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import { useStuntingSweeperData } from "@/hooks/query/use-stuntingsweeper";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataStuntingBulan from "./data-stunting-bulan";
import DataStuntingKecamatan from "./data-stunting-kecamatan";
import DataStuntingKelurahan from "./data-stunting-kelurahan";
import DataStuntingPuskesmas from "./data-stunting-puskesmas";
import DataStuntingPosyandu from "./data-stunting-posyandu";

export default function DataStuntingData() {
  const { data: apiData, isLoading: isLoadingApiData } =
    useStuntingSweeperData();
  const totalBalita = Number(apiData?.data?.totalBalita ?? 0);
  const bbu = apiData?.data?.status?.bbu ?? {};
  const tbu = apiData?.data?.status?.tbu ?? {};
  const bbtb = apiData?.data?.status?.bbtb ?? {};
  const bbuEntries = Object.entries(bbu).map(([k, v]) => ({
    label: k,
    value: Number(v),
  }));
  const tbuEntries = Object.entries(tbu).map(([k, v]) => ({
    label: k,
    value: Number(v),
  }));
  const bbtbEntries = Object.entries(bbtb).map(([k, v]) => ({
    label: k,
    value: Number(v),
  }));
  const sum = (arr: { value: number }[]) =>
    arr.reduce((a, c) => a + c.value, 0);
  const sumBBU = sum(bbuEntries);
  const sumTBU = sum(tbuEntries);
  const sumBBTB = sum(bbtbEntries);
  const percent = (v: number, s: number) =>
    s > 0 ? Math.round((v / s) * 100) : 0;
  const colorMapBBU: Record<string, string> = {
    "BB Sangat Kurang": "bg-rose-500",
    "BB Kurang": "bg-orange-500",
    "BB Normal": "bg-emerald-500",
    "Resiko BB Lebih": "bg-amber-500",
  };
  const colorMapTBU: Record<string, string> = {
    "Sangat Pendek": "bg-rose-500",
    Pendek: "bg-orange-500",
    Normal: "bg-emerald-500",
    Tinggi: "bg-cyan-500",
    Stunting: "bg-red-600",
  };
  const colorMapBBTB: Record<string, string> = {
    "Gizi Buruk": "bg-rose-500",
    "Gizi Kurang": "bg-orange-500",
    "Gizi Baik": "bg-emerald-500",
    "Berisiko Gizi Lebih": "bg-amber-500",
    "Gizi Lebih": "bg-yellow-500",
    Obesitas: "bg-red-600",
  };
  const percentTotal = (v: number) => percent(v, totalBalita);
  const sortDesc = (arr: { label: string; value: number }[]) =>
    [...arr].sort((a, b) => b.value - a.value);
  const bbuSorted = sortDesc(bbuEntries);
  const tbuSorted = sortDesc(tbuEntries);
  const tbuNonStuntingSorted = sortDesc(
    tbuEntries.filter((e) => e.label !== "Stunting")
  );
  const bbtbSorted = sortDesc(bbtbEntries);

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan Penangan Stunting"
        description={
          <>
            Last update: {apiData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : Stunting Sweeper)</span>
            {/* <div className="mt-1 space-y-0.5 text-xs ">
              <p>
                <span className="font-bold">BBU</span> (Berat Badan menurut
                Umur)
              </p>
              <p>
                <span className="font-bold">TBU</span> (Tinggi Badan menurut
                Umur)
              </p>
              <p>
                <span className="font-bold">BBTB</span> (Berat Badan menurut
                Tinggi Badan)
              </p>
            </div> */}
          </>
        }
        action={
          <ModalDetail
            title="Detail Layanan Penangan Stunting"
            description="Ringkasan dan detail per kategori. Gulir untuk melihat semua informasi."
            contentModal={
              <Tabs defaultValue="bulan" className="flex flex-col gap-3">
                <TabsList>
                  <TabsTrigger value="bulan">Bulan</TabsTrigger>
                  <TabsTrigger value="puskesmas">Puskesmas</TabsTrigger>
                  <TabsTrigger value="posyandu">Posyandu</TabsTrigger>
                  <TabsTrigger value="kecamatan">Kecamatan</TabsTrigger>
                  <TabsTrigger value="kelurahan">Kelurahan</TabsTrigger>
                </TabsList>
                <div className="h-[60vh] overflow-y-auto rounded-md border">
                  <TabsContent value="bulan" className="p-3">
                    <DataStuntingBulan />
                  </TabsContent>
                  <TabsContent value="puskesmas" className="p-3">
                    <DataStuntingPuskesmas />
                  </TabsContent>
                  <TabsContent value="posyandu" className="p-3">
                    <DataStuntingPosyandu />
                  </TabsContent>
                  <TabsContent value="kecamatan" className="p-3">
                    <DataStuntingKecamatan />
                  </TabsContent>
                  <TabsContent value="kelurahan" className="p-3">
                    <DataStuntingKelurahan />
                  </TabsContent>
                </div>
              </Tabs>
            }
          />
        }
      >
        {isLoadingApiData ? (
          <LoadingSkeleton rows={2} cols={4} />
        ) : (
          (() => {
            return (
              <div className="h-full flex flex-col space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 h-full flex-1">
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("Total Balita")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                          Total Balita
                        </div>
                        <div className="text-[10px] md:text-[11px] opacity-80">
                          Data Balita Terdata
                        </div>
                      </div>
                      <div className="text-base md:text-lg font-bold tabular-nums">
                        {totalBalita.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("BBU")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                          BBU
                        </div>
                        <div className="text-[10px] md:text-[11px] opacity-80">
                          Berat Badan menurut Umur
                        </div>
                      </div>
                      <div className="text-base md:text-lg font-bold tabular-nums">
                        {sumBBU.toLocaleString("id-ID")}
                      </div>
                    </div>
                    {/* <div className="mt-2 h-1.5 rounded-lg overflow-hidden ring-1 ring-white/20 flex">
                      {bbuEntries.map((e) => (
                        <div
                          key={e.label}
                          style={{ width: `${percent(e.value, sumBBU)}%` }}
                          className={cn(colorMapBBU[e.label] || "bg-primary")}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-[10px] md:text-[11px] opacity-80">
                      Dominan: {bbuSorted[0]?.label}{" "}
                      {percent(bbuSorted[0]?.value || 0, sumBBU)}%
                    </div> */}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("TBU")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                          TBU
                        </div>
                        <div className="text-[10px] md:text-[11px] opacity-80">
                          Tinggi Badan menurut Umur
                        </div>
                      </div>
                      <div className="text-base md:text-lg font-bold tabular-nums">
                        {sumTBU.toLocaleString("id-ID")}
                      </div>
                    </div>
                    {/* <div className="mt-2 h-1.5 rounded-lg overflow-hidden ring-1 ring-white/20 flex">
                      {tbuEntries.map((e) => (
                        <div
                          key={e.label}
                          style={{ width: `${percent(e.value, sumTBU)}%` }}
                          className={cn(colorMapTBU[e.label] || "bg-primary")}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-[10px] md:text-[11px] opacity-80">
                      Dominan: {tbuNonStuntingSorted[0]?.label}{" "}
                      {percent(tbuNonStuntingSorted[0]?.value || 0, sumTBU)}%
                    </div> */}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("BBTB")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                          BBTB
                        </div>
                        <div className="text-[10px] md:text-[11px] opacity-80">
                          Berat Badan menurut Tinggi Badan
                        </div>
                      </div>
                      <div className="text-base md:text-lg font-bold tabular-nums">
                        {sumBBTB.toLocaleString("id-ID")}
                      </div>
                    </div>
                    {/* <div className="mt-2 h-1.5 rounded-lg overflow-hidden ring-1 ring-white/20 flex">
                      {bbtbEntries.map((e) => (
                        <div
                          key={e.label}
                          style={{ width: `${percent(e.value, sumBBTB)}%` }}
                          className={cn(colorMapBBTB[e.label] || "bg-primary")}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-[10px] md:text-[11px] opacity-80">
                      Dominan: {bbtbSorted[0]?.label}{" "}
                      {percent(bbtbSorted[0]?.value || 0, sumBBTB)}%
                    </div> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-full flex-1">
                  {[
                    {
                      key: "BBU",
                      keyLabel: "Berat Badan menurut Umur",
                      entries: bbuSorted,
                      sum: sumBBU,
                      colorMap: colorMapBBU,
                    },
                    {
                      key: "TBU",
                      keyLabel: "Tinggi Badan menurut Umur",
                      entries: tbuSorted,
                      sum: sumTBU,
                      colorMap: colorMapTBU,
                    },
                    {
                      key: "BBTB",
                      keyLabel: "Berat Badan menurut Tinggi Badan",
                      entries: bbtbSorted,
                      sum: sumBBTB,
                      colorMap: colorMapBBTB,
                    },
                  ].map((section) => (
                    <div
                      key={section.key}
                      className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex flex-col gap-2"
                    >
                      <ShineBorder
                        shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold">
                          {section.key}{" "}
                          <p className="text-[10px] md:text-[11px] opacity-80 italic">
                            {section.keyLabel}
                          </p>
                        </div>
                        <div className="text-xs font-bold tabular-nums">
                          {section.sum.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {section.entries.map((e) => (
                          <div
                            key={e.label}
                            className="rounded-lg p-2 border bg-muted/30 flex items-center justify-between"
                          >
                            <div
                              className="text-[12px] font-medium truncate"
                              title={e.label}
                            >
                              {e.label}
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-mono font-semibold tabular-nums text-white",
                                getPatternByKey(e.label)
                              )}
                            >
                              {e.value.toLocaleString("id-ID")}
                            </span>
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
