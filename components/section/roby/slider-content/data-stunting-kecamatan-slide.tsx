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
import { useDashboardStore } from "@/hooks/use-dashboard";
import KecamatanGroupGrid from "../data/stunting/kecamatan-group-grid";
import LoadingContent from "../data/loading-content";

type Props = { onDone?: () => void; fullSize?: boolean; active?: boolean };
export default function DataStuntingKecamatanSlide({
  onDone,
  fullSize,
  active,
}: Props) {
  const { data: apiData, isLoading: isLoadingApiData } =
    useStuntingSweeperKecamatanData();
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [paused, setPaused] = React.useState(false);
  const pausedRef = React.useRef(false);
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const speed = useDashboardStore((s) => s.speed);
  const childSpeed = useDashboardStore((s) => s.childSpeed);
  const isGlobalPaused = useDashboardStore((s) => s.isGlobalPaused);
  const safeSpeed = speed >= 3000 ? speed : 3000;
  const safeChildSpeed = childSpeed >= 3000 ? childSpeed : 3000;

  React.useEffect(() => {
    if (!api || !active) return;
    const id = setInterval(() => {
      if (!pausedRef.current && !isGlobalPaused) {
        api.scrollNext();
      }
    }, safeChildSpeed);
    return () => clearInterval(id);
  }, [api, active, safeChildSpeed, isGlobalPaused]);

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
    if (active && snaps.length <= 1 && !isGlobalPaused) {
      const id = setTimeout(() => onDone?.(), safeSpeed);
      return () => clearTimeout(id);
    }
  }, [api, active, onDone, safeSpeed, isGlobalPaused]);

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

  const items: KecamatanItem[] = React.useMemo(
    () =>
      Array.isArray(apiData?.data)
        ? (apiData?.data as unknown as KecamatanItem[])
        : [],
    [apiData]
  );

  const itemsSorted = React.useMemo(
    () =>
      [...items].sort((a, b) => toNum(b.totalBalita) - toNum(a.totalBalita)),
    [items]
  );

  const qLower = q.trim().toLowerCase();
  const itemsFiltered = React.useMemo(
    () =>
      qLower
        ? itemsSorted.filter((it) =>
            String(it.nama).toLowerCase().includes(qLower)
          )
        : itemsSorted,
    [itemsSorted, qLower]
  );

  const pages = React.useMemo(
    () =>
      Array.from({ length: Math.ceil(itemsFiltered.length / 5) }, (_, i) =>
        itemsFiltered.slice(i * 5, i * 5 + 5)
      ),
    [itemsFiltered]
  );

  return (
    <>
      <CardComponent
        className={cn(
          fullSize ? "p-2 shadow-lg w-full h-full" : "p-4 shadow-lg"
        )}
        title="Data Penangan Stunting"
        description={
          <>
            Last update:{" "}
            <span suppressHydrationWarning>{apiData?.last_get ?? ""}</span>
            <br />
            <span className="italic text-xs">(Sumber : Stunting Sweeper)</span>
          </>
        }
        action={
          <>
            <div className="flex items-center gap-2">
              <ModalDetail
                title="Detail Data Penangan Stunting"
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
        <div className="h-full flex flex-col space-y-3 relative">
          {isLoadingApiData && (
            <div className="absolute inset-0 z-50 bg-background/50 flex items-center justify-center">
              <LoadingContent />
            </div>
          )}

          <Carousel
            className={cn(fullSize ? "w-full flex-1 min-h-0" : "w-full")}
            opts={{ loop: true, align: "start" }}
            setApi={setApi}
            onMouseEnter={() => active && setPaused(true)}
            onMouseLeave={() => active && setPaused(false)}
            onTouchStart={() => active && setPaused(true)}
            onTouchEnd={() => active && setPaused(false)}
          >
            <CarouselContent
              className={cn("items-stretch", fullSize ? "h-full" : undefined)}
            >
              <CarouselItem>
                <DataStuntingSlide />
              </CarouselItem>
              {pages.map((group, pidx) => (
                <CarouselItem key={`page-${pidx}`}>
                  <KecamatanGroupGrid group={group} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div
            className={cn(
              fullSize
                ? "flex justify-center gap-2"
                : "mt-3 flex justify-center gap-2"
            )}
          >
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Ke slide ${idx + 1}`}
                onClick={() => api?.scrollTo(idx)}
                className={cn(
                  "h-7 min-w-7 md:h-8 md:min-w-8 px-2 inline-flex items-center justify-center rounded-md border transition-colors font-mono text-xs md:text-sm tabular-nums",
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
      </CardComponent>
    </>
  );
}
