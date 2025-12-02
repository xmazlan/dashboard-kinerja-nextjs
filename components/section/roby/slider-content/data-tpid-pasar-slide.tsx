"use client";
import React from "react";
import CardComponent from "@/components/card/card-component";
import { cn } from "@/lib/utils";

import LoadingSkeleton from "@/components/loading-skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OptimizeImage from "@/components/optimize-image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTpidPasarData } from "@/hooks/query/use-tpid";
import { ShineBorder } from "@/components/magicui/shine-border";
import { getPatternByKey } from "@/components/patern-collor";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTpidKomoditiDetail from "../data/tpid/data-tpid-komoditi-detail";
import DataTpidPasar from "../data/tpid/data-tpid-pasar";
import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import LoadingContent from "../data/loading-content";
import LayoutCard from "@/components/card/layout-card";
import { useDashboardStore } from "@/hooks/use-dashboard";
type Props = { onDone?: () => void; fullSize?: boolean; active?: boolean };
export default function DataTpidPasarSlide({
  onDone,
  fullSize,
  active,
}: Props) {
  const { data: masterData, isLoading: isLoadingMasterData } =
    useTpidPasarData();
  const [query, setQuery] = React.useState("");
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [paused, setPaused] = React.useState(false);
  const pausedRef = React.useRef(false);
  const [expandedAll, setExpandedAll] = React.useState(false);
  const speed = useDashboardStore((s) => s.speed);

  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  React.useEffect(() => {
    if (!api || !active) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        api.scrollNext();
      }
    }, speed);
    return () => clearInterval(id);
  }, [api, active, speed]);

  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const prevRef = React.useRef(0);
  React.useEffect(() => {
    if (!api) return;
    const snaps = api.scrollSnapList();
    setScrollSnaps(snaps);
    const last = Math.max(0, snaps.length - 1);
    const onSelect = () => {
      const cur = api.selectedScrollSnap();
      setSelectedIndex(cur);
      if (active && snaps.length > 1 && prevRef.current === last && cur === 0) {
        onDone?.();
      }
      prevRef.current = cur;
    };
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api, active, onDone]);
  React.useEffect(() => {
    if (!api) return;
    const snaps = api.scrollSnapList();
    if (active && snaps.length <= 1) {
      const id = setTimeout(() => onDone?.(), speed);
      return () => clearTimeout(id);
    }
  }, [api, active, onDone, speed]);
  const toNum = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  const cleanUrl = (s: unknown) =>
    String(s ?? "")
      .replace(/`/g, "")
      .trim();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Data Pasar dan Harga Komoditas"
        description={
          <>
            Last update: {masterData?.last_get ?? ""}
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
                  title="Detail Layanan Tim Pengendalian Inflasi Daerah (Komoditi)"
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
        {isLoadingMasterData ? (
          <LoadingContent />
        ) : (
          (() => {
            interface TpidCommodity {
              nama_komoditas?: string;
              satuan?: string;
              harga?: number | string;
              gambar?: string;
              category?: string;
            }
            interface TpidMarket {
              nama_pasar?: string;
              address?: string;
              harga_komoditas?: TpidCommodity[];
            }

            const markets: TpidMarket[] = Array.isArray(masterData?.data)
              ? (masterData?.data as unknown as TpidMarket[])
              : [];
            const filtered = markets
              .map((m) => {
                const list: TpidCommodity[] = Array.isArray(m?.harga_komoditas)
                  ? (m.harga_komoditas as TpidCommodity[])
                  : [];
                const items = list
                  .map((c: TpidCommodity, idx: number) => ({
                    key: `${m?.nama_pasar ?? "-"}-${c?.nama_komoditas ?? "-"}-${
                      c?.satuan ?? "-"
                    }-${idx}`,
                    komoditas: String(c?.nama_komoditas || "-"),
                    satuan: String(c?.satuan || "-"),
                    harga: toNum(c?.harga),
                    img: cleanUrl(c?.gambar),
                  }))
                  .sort((a, b) => a.komoditas.localeCompare(b.komoditas));
                return {
                  nama_pasar: String(m?.nama_pasar || "-"),
                  address: String(m?.address || "-"),
                  items,
                };
              })
              .filter((m) =>
                m.nama_pasar.toLowerCase().includes(query.toLowerCase())
              )
              .sort((a, b) => a.nama_pasar.localeCompare(b.nama_pasar));

            if (filtered.length === 0) {
              return (
                <div className="w-full text-center text-muted-foreground py-6">
                  Tidak ada data
                </div>
              );
            }

            const FIRST_N = 15;
            return (
              <div className="h-full flex flex-col gap-3">
                <Carousel
                  className="w-full h-full"
                  opts={{ loop: true, align: "start" }}
                  setApi={setApi}
                  onMouseEnter={() => active && setPaused(true)}
                  onMouseLeave={() => active && setPaused(false)}
                  onTouchStart={() => active && setPaused(true)}
                  onTouchEnd={() => active && setPaused(false)}
                >
                  <CarouselContent className="items-stretch">
                    {filtered.map((mkt, idx) => {
                      const head = mkt.items.slice(0, FIRST_N);
                      const tail = mkt.items.slice(FIRST_N);
                      return (
                        <CarouselItem
                          key={`${mkt.nama_pasar}-${idx}`}
                          // className="md:basis-1/2"
                          className=""
                        >
                          <LayoutCard
                            className=""
                            ratioDesktop={0.5}
                            ratioMobile={0.38}
                          >
                            <div
                              className="flex h-full flex-col gap-2"
                              title={`${mkt.nama_pasar} — ${mkt.address}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-[12px] md:text-sm font-semibold truncate">
                                    {mkt.nama_pasar}
                                  </div>
                                  <div className="text-[10px] opacity-70 truncate">
                                    {mkt.address}
                                  </div>
                                </div>
                                <Badge className="shrink-0" variant="secondary">
                                  {mkt.items.length} komoditas
                                </Badge>
                              </div>

                              <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                                {head.map((it) => (
                                  <div
                                    key={it.key}
                                    className={cn(
                                      "rounded-md p-2 border flex items-center justify-between gap-2 text-white",
                                      getPatternByKey(it.komoditas)
                                    )}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <OptimizeImage
                                        src={it.img}
                                        alt={it.komoditas}
                                        width={32}
                                        height={32}
                                        containerClassName="w-7 h-7 rounded-sm bg-muted overflow-hidden"
                                        imgClassName="rounded-sm object-cover w-full h-full"
                                      />
                                      <div className="min-w-0">
                                        <div className="text-[12px] font-medium truncate">
                                          {it.komoditas}
                                        </div>
                                        <div className="text-[10px] opacity-70 truncate">
                                          {it.satuan}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-[12px] font-mono font-semibold tabular-nums">
                                      {it.harga.toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {tail.length > 0 && (
                                <Collapsible
                                  open={expandedAll}
                                  onOpenChange={setExpandedAll}
                                >
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2"
                                    >
                                      {expandedAll
                                        ? "Tutup komoditas"
                                        : `Lihat semua komoditas (${tail.length} lagi)`}
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                                      {tail.map((it) => (
                                        <div
                                          key={it.key}
                                          className={cn(
                                            "rounded-md p-2 border flex items-center justify-between gap-2 text-white",
                                            getPatternByKey(it.komoditas)
                                          )}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <OptimizeImage
                                              src={it.img}
                                              alt={it.komoditas}
                                              width={32}
                                              height={32}
                                              containerClassName="w-7 h-7 rounded-sm bg-muted overflow-hidden"
                                              imgClassName="rounded-sm object-cover w-full h-full"
                                            />
                                            <div className="min-w-0">
                                              <div className="text-[12px] font-medium truncate">
                                                {it.komoditas}
                                              </div>
                                              <div className="text-[10px] opacity-70 truncate">
                                                {it.satuan}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-[12px] font-mono font-semibold tabular-nums">
                                            {it.harga.toLocaleString("id-ID")}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}
                            </div>
                          </LayoutCard>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80 h-6 w-6 md:h-8 md:w-8" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80 h-6 w-6 md:h-8 md:w-8" /> */}
                </Carousel>
                <div className="mt-3 flex justify-center gap-2">
                  {scrollSnaps.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Ke slide ${idx + 1}`}
                      onClick={() => api?.scrollTo(idx)}
                      className={cn(
                        "h-7 min-w-[28px] md:h-8 md:min-w-[32px] px-2 inline-flex items-center justify-center rounded-md border transition-colors font-mono text-xs md:text-sm tabular-nums",
                        idx === selectedIndex
                          ? "bg-primary text-white border-primary"
                          : "bg-transparent text-foreground/70 border-border hover:text-foreground"
                      )}
                    >
                      {idx + 1}
                    </button>
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
