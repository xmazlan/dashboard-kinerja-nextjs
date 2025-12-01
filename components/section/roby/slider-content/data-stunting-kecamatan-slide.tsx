import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import { useStuntingSweeperKecamatanData } from "@/hooks/query/use-stuntingsweeper";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import DataStuntingData from "../data/stunting/data-stunting";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataStuntingBulan from "../data/stunting/data-stunting-bulan";
import DataStuntingPuskesmas from "../data/stunting/data-stunting-puskesmas";
import DataStuntingPosyandu from "../data/stunting/data-stunting-posyandu";
import DataStuntingKecamatan from "../data/stunting/data-stunting-kecamatan";
import DataStuntingKelurahan from "../data/stunting/data-stunting-kelurahan";
import DataStuntingSlide from "../data/stunting/data-stunting-slide";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DataStuntingKecamatanSlide() {
  const { data: apiData, isLoading: isLoadingApiData } =
    useStuntingSweeperKecamatanData();
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [paused, setPaused] = React.useState(false);
  const pausedRef = React.useRef(false);
  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        api.scrollNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [api]);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  const toNum = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  interface KecamatanItem {
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
  const items: KecamatanItem[] = Array.isArray(apiData?.data)
    ? (apiData?.data as unknown as KecamatanItem[])
    : [];
  const itemsSorted = [...items].sort(
    (a, b) => toNum(b.totalBalita) - toNum(a.totalBalita)
  );
  const qLower = q.trim().toLowerCase();
  const itemsFiltered = qLower
    ? itemsSorted.filter((it) => String(it.nama).toLowerCase().includes(qLower))
    : itemsSorted;
  const totalBalitaAll = itemsSorted.reduce(
    (acc, it) => acc + toNum(it.totalBalita),
    0
  );

  return (
    <>
      <CardComponent
        className="p-2  shadow-lg"
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
          <>
            <div className="flex items-center gap-2">
              {/* <InputGroup>
                <InputGroupAddon>
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama kecamatan..."
                  className="w-[220px] md:w-[280px]"
                />
              </InputGroup>
              <Badge variant="outline">
                Total kecamatan: {itemsFiltered.length}
              </Badge> */}
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
            </div>
          </>
        }
      >
        {isLoadingApiData ? (
          <LoadingSkeleton rows={2} cols={4} />
        ) : (
          (() => {
            const pages = Array.from(
              { length: Math.ceil(itemsFiltered.length / 5) },
              (_, i) => itemsFiltered.slice(i * 5, i * 5 + 5)
            );
            return (
              <div className="h-full flex flex-col space-y-3">
                <Carousel
                  className="w-full"
                  opts={{ loop: true, align: "start" }}
                  setApi={setApi}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onTouchStart={() => setPaused(true)}
                  onTouchEnd={() => setPaused(false)}
                >
                  <CarouselContent className="items-stretch">
                    <CarouselItem>
                      <DataStuntingSlide />
                    </CarouselItem>
                    {pages.map((group, pidx) => (
                      <CarouselItem key={`page-${pidx}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                          {group.map((it, idx) => (
                            <div
                              key={`${it.nama}-${idx}`}
                              className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex flex-col gap-2 h-full"
                            >
                              <ShineBorder
                                shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                              />
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold">
                                  {it.nama}
                                </div>
                                <div className="text-xs font-bold tabular-nums">
                                  {toNum(it.totalBalita).toLocaleString(
                                    "id-ID"
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {[
                                  {
                                    label: "Gizi Buruk",
                                    value: toNum(it.gizi_buruk),
                                  },
                                  {
                                    label: "Gizi Kurang",
                                    value: toNum(it.gizi_kurang),
                                  },
                                  {
                                    label: "Gizi Baik",
                                    value: toNum(it.gizi_baik),
                                  },
                                  {
                                    label: "Gizi Lebih",
                                    value: toNum(it.gizi_lebih),
                                  },
                                  {
                                    label: "Obesitas",
                                    value: toNum(it.obesitas),
                                  },
                                  {
                                    label: "Stunting",
                                    value: toNum(it.stunting),
                                  },
                                  {
                                    label: "BB Kurang",
                                    value: toNum(it.bb_kurang),
                                  },
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
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <div className="mt-3 flex justify-center gap-2">
                  {scrollSnaps.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Ke slide ${idx + 1}`}
                      onClick={() => api?.scrollTo(idx)}
                      className={cn(
                        "h-2 w-2 rounded-full transition-colors",
                        idx === selectedIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>
            );
          })()
        )}
      </CardComponent>
    </>
  );
}
