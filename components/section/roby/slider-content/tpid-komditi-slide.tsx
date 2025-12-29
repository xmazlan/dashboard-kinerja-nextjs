"use client";
import React from "react";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import CardComponent from "@/components/card/card-component";
import { useDashboardStore } from "@/hooks/use-dashboard";
import { useTpidKomoditiData } from "@/hooks/query/use-tpid";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
import OptimizeImage from "@/components/optimize-image";
import { ShineBorder } from "@/components/magicui/shine-border";
import LoadingSkeleton from "@/components/loading-skeleton";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTpidKomoditiDetail from "../data/tpid/data-tpid-komoditi-detail";
import DataTpidPasar from "../data/tpid/data-tpid-pasar";
import LoadingContent from "../data/loading-content";

type Props = { onDone?: () => void; fullSize?: boolean; active?: boolean };
export default function SectionTpidKomoditiSlide({
  onDone,
  fullSize,
  active,
}: Props) {
  const { data: masterData, isLoading: isLoadingMasterData } =
    useTpidKomoditiData();
  // State & kontrol untuk Carousel CHART
  const [chartApi, setChartApi] = React.useState<CarouselApi | null>(null);
  const [chartPaused, setChartPaused] = React.useState(false);
  const chartPausedRef = React.useRef(false);
  const speed = useDashboardStore((s) => s.speed);

  React.useEffect(() => {
    chartPausedRef.current = chartPaused;
  }, [chartPaused]);

  // Autoplay sesuai pengaturan, berhenti saat hover/touch (CHART)
  React.useEffect(() => {
    if (!chartApi) return;
    const id = setInterval(() => {
      if (!chartPausedRef.current) {
        chartApi.scrollNext();
      }
    }, speed);
    return () => clearInterval(id);
  }, [chartApi, speed]);

  const [chartScrollSnaps, setChartScrollSnaps] = React.useState<number[]>([]);
  const [chartSelectedIndex, setChartSelectedIndex] = React.useState(0);

  const prevRef = React.useRef(0);
  React.useEffect(() => {
    if (!chartApi) return;
    const snaps = chartApi.scrollSnapList();
    setChartScrollSnaps(snaps);
    const last = Math.max(0, snaps.length - 1);
    const onSelect = () => {
      const cur = chartApi.selectedScrollSnap();
      setChartSelectedIndex(cur);
      if (active && snaps.length > 1 && prevRef.current === last && cur === 0) {
        onDone?.();
      }
      prevRef.current = cur;
    };
    chartApi.on("select", onSelect);
    onSelect();
    return () => {
      chartApi.off("select", onSelect);
    };
  }, [chartApi, active, onDone]);
  React.useEffect(() => {
    if (!chartApi) return;
    const snaps = chartApi.scrollSnapList();
    if (active && snaps.length <= 1) {
      const id = setTimeout(() => onDone?.(), speed);
      return () => clearTimeout(id);
    }
  }, [chartApi, active, onDone, speed]);

  React.useEffect(() => {
    if (!chartApi) return;
    if (active) {
      chartApi.scrollTo(0);
      setChartPaused(false);
    }
  }, [active, chartApi]);

  return (
    <>
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full p-2 "
        title="Data Pasar dan Harga Komoditas"
        description={
          <>
            Last update:{" "}
            <span suppressHydrationWarning>{masterData?.last_get ?? ""}</span>
            <br />
            <span className="italic text-xs">(Sumber : TPID)</span>
          </>
        }
        action={(() => {
          const totalPasar = Array.isArray(masterData?.data)
            ? (masterData?.data as unknown[]).length
            : 0;
          return (
            <>
              <div className="flex items-center gap-2">
                {/* <InputGroup>
                  <InputGroupAddon>
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari nama pasar..."
                    className="w-[220px] md:w-[280px]"
                  />
                </InputGroup>
                <Badge variant="outline">Total pasar: {totalPasar}</Badge> */}
                <ModalDetail
                  title="Detail Data Tim Pengendalian Inflasi Daerah (Komoditi)"
                  description="Ringkasan dan detail per kategori. Gulir untuk melihat semua informasi."
                  contentModal={
                    <Tabs defaultValue="detail" className="flex flex-col gap-3">
                      <TabsList>
                        <TabsTrigger value="detail">Detail</TabsTrigger>
                        <TabsTrigger value="pasar">Pasar</TabsTrigger>
                      </TabsList>
                      <div className="h-[60vh] overflow-y-auto rounded-lg border">
                        <TabsContent value="detail" className="p-3">
                          <DataTpidKomoditiDetail />
                        </TabsContent>
                        <TabsContent value="pasar" className="p-3">
                          <DataTpidPasar />
                        </TabsContent>
                      </div>
                    </Tabs>
                  }
                />
              </div>
            </>
          );
        })()}
      >
        <div className="flex h-full flex-col">
          {isLoadingMasterData ? (
            <LoadingContent />
          ) : (
            (() => {
              const toNum = (v: any) => Number(v ?? 0);
              const cleanUrl = (s: any) =>
                String(s ?? "")
                  .replace(/`/g, "")
                  .trim();
              const items: Array<any> = (masterData?.data ?? []) as any[];
              const itemsSorted = [...items].sort((a, b) => {
                const ak = toNum(
                  a?.harga_per_satuan_komoditas?.KG?.harga_rata_rata
                );
                const bk = toNum(
                  b?.harga_per_satuan_komoditas?.KG?.harga_rata_rata
                );
                return bk - ak;
              });
              const perPage = 3; // 1 baris x 3 kolom
              const pages = Array.from(
                { length: Math.ceil(itemsSorted.length / perPage) },
                (_, i) => itemsSorted.slice(i * perPage, i * perPage + perPage)
              );
              return (
                <Carousel
                  className="w-full flex-1 min-h-0"
                  opts={{ loop: true, align: "start" }}
                  setApi={setChartApi}
                  onMouseEnter={() => setChartPaused(true)}
                  onMouseLeave={() => setChartPaused(false)}
                  onTouchStart={() => setChartPaused(true)}
                  onTouchEnd={() => setChartPaused(false)}
                >
                  <CarouselContent className="h-full ">
                    {pages.map((page, pidx) => (
                      <CarouselItem
                        key={`page-${pidx}`}
                        className="h-full max-w-full flex items-center justify-center py-3"
                      >
                        <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                          {page.map((it) => {
                            const kg = it?.harga_per_satuan_komoditas?.KG ?? {};
                            const hargaRata = toNum(kg?.harga_rata_rata);
                            const hargaMurah = toNum(kg?.harga_termurah);
                            const hargaMahal = toNum(kg?.harga_termahal);
                            const status = String(kg?.status ?? "");
                            const imgSrc = cleanUrl(it?.gambar);
                            const hargaPerPasar = kg?.harga_per_pasar ?? {};
                            return (
                              <div
                                key={it.id}
                                className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-2"
                              >
                                <ShineBorder
                                  shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                                />
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <OptimizeImage
                                      src={imgSrc}
                                      alt={String(it?.nama_komoditas || "-")}
                                      width={40}
                                      height={40}
                                      containerClassName="w-9 h-9 rounded-sm bg-muted overflow-hidden"
                                      imgClassName="rounded-sm object-cover w-full h-full"
                                    />
                                    <div>
                                      <div className="text-sm md:text-base font-semibold">
                                        {it.nama_komoditas}
                                      </div>
                                      <div className="text-[10px] opacity-70">
                                        Satuan: KG • Tgl: {kg?.tgl ?? "-"}
                                      </div>
                                    </div>
                                  </div>
                                  <span
                                    className={cn(
                                      "inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-semibold text-white",
                                      status
                                        ? getPatternByKey(status)
                                        : NEUTRAL_PATTERN
                                    )}
                                  >
                                    {status || "-"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                                  <div
                                    className={cn(
                                      "rounded-lg p-2 text-white",
                                      getPatternByKey("Rata-rata")
                                    )}
                                  >
                                    <div className="text-[10px] uppercase opacity-90">
                                      Rata-rata
                                    </div>
                                    <div
                                      className="text-base md:text-lg font-bold tabular-nums"
                                      suppressHydrationWarning
                                    >
                                      {hargaRata.toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                  <div
                                    className={cn(
                                      "rounded-lg p-2 text-white",
                                      getPatternByKey("Termurah")
                                    )}
                                  >
                                    <div className="text-[10px] uppercase opacity-90">
                                      Termurah
                                    </div>
                                    <div
                                      className="text-base md:text-lg font-bold tabular-nums"
                                      suppressHydrationWarning
                                    >
                                      {hargaMurah.toLocaleString("id-ID")}
                                    </div>
                                    <div className="text-[10px] opacity-80">
                                      {kg?.pasar_termurah ?? "-"}
                                    </div>
                                  </div>
                                  <div
                                    className={cn(
                                      "rounded-lg p-2 text-white",
                                      getPatternByKey("Termahal")
                                    )}
                                  >
                                    <div className="text-[10px] uppercase opacity-90">
                                      Termahal
                                    </div>
                                    <div
                                      className="text-base md:text-lg font-bold tabular-nums"
                                      suppressHydrationWarning
                                    >
                                      {hargaMahal.toLocaleString("id-ID")}
                                    </div>
                                    <div className="text-[10px] opacity-80">
                                      {kg?.pasar_termahal ?? "-"}
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1  gap-2">
                                  {Object.entries(hargaPerPasar).map(
                                    ([pasar, harga]) => (
                                      <div
                                        key={`${it.id}-${pasar}`}
                                        className="rounded-lg p-2 border bg-muted/30 flex items-center justify-between"
                                      >
                                        <div
                                          className="text-[12px] font-medium truncate"
                                          title={pasar}
                                        >
                                          {pasar}
                                        </div>
                                        <span
                                          className={cn(
                                            "inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-mono font-semibold tabular-nums text-white",
                                            getPatternByKey(pasar)
                                          )}
                                          suppressHydrationWarning
                                        >
                                          {toNum(harga).toLocaleString("id-ID")}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80 h-6 w-6 md:h-8 md:w-8" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80 h-6 w-6 md:h-8 md:w-8" /> */}
                </Carousel>
              );
            })()
          )}
          <div className="mt-3 flex justify-center gap-2 mb-3">
            {chartScrollSnaps.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Ke slide ${idx + 1}`}
                onClick={() => chartApi?.scrollTo(idx)}
                className={cn(
                  "h-7 min-w-7 md:h-8 md:min-w-8 px-2 inline-flex items-center justify-center rounded-md border transition-colors font-mono text-xs md:text-sm tabular-nums",
                  idx === chartSelectedIndex
                    ? "bg-primary text-white border-primary"
                    : "bg-transparent text-foreground/70 border-border hover:text-foreground"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </CardComponent>
    </>
  );
}
