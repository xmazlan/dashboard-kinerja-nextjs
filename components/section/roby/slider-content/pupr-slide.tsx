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
import { usePengaduanEresponMasterData } from "@/hooks/query/use-pengaduan-erespon";
import DataEresponMasterData from "../data/pengaduan/data-erespon-master-data";
import DataPupr from "../data/pupr/data-pupr";

type Props = { onDone?: () => void; fullSize?: boolean; active?: boolean };
export default function SectionPuprDataSlide({
  onDone,
  fullSize,
  active,
}: Props) {
  // State & kontrol untuk Carousel CHART
  const [chartApi, setChartApi] = React.useState<CarouselApi | null>(null);
  const [chartPaused, setChartPaused] = React.useState(false);
  const chartPausedRef = React.useRef(false);
  const { data: masterData, isLoading: isLoadingMasterData } =
    usePengaduanEresponMasterData();
  const speed = useDashboardStore((s) => s.speed);

  React.useEffect(() => {
    chartPausedRef.current = chartPaused;
  }, [chartPaused]);

  React.useEffect(() => {
    if (!chartApi || !active) return;
    const id = setInterval(() => {
      if (!chartPausedRef.current) {
        chartApi.scrollNext();
      }
    }, speed);
    return () => clearInterval(id);
  }, [chartApi, active, speed]);

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

  // State & kontrol untuk Carousel NON-CHART (Contoh Carousel)
  const [contentApi, setContentApi] = React.useState<CarouselApi | null>(null);
  const [contentPaused, setContentPaused] = React.useState(false);
  const contentPausedRef = React.useRef(false);
  const childSpeed = useDashboardStore((s) => s.childSpeed);

  React.useEffect(() => {
    contentPausedRef.current = contentPaused;
  }, [contentPaused]);

  // Autoplay konten tambahan, berhenti saat hover/touch (NON-CHART)
  React.useEffect(() => {
    if (!contentApi) return;
    const id = setInterval(() => {
      if (!contentPausedRef.current) {
        contentApi.scrollNext();
      }
    }, childSpeed);
    return () => clearInterval(id);
  }, [contentApi, childSpeed]);

  const [contentScrollSnaps, setContentScrollSnaps] = React.useState<number[]>(
    []
  );
  const [contentSelectedIndex, setContentSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!contentApi) return;
    setContentScrollSnaps(contentApi.scrollSnapList());
    const onSelect = () =>
      setContentSelectedIndex(contentApi.selectedScrollSnap());
    contentApi.on("select", onSelect);
    onSelect();
    return () => {
      contentApi.off("select", onSelect);
    };
  }, [contentApi]);

  return (
    <>
      <CardComponent className="p-3 shadow-lg border rounded-lg bg-card">
        <Carousel
          className="w-full"
          opts={{ loop: true, align: "start" }}
          setApi={setChartApi}
          onMouseEnter={() => active && setChartPaused(true)}
          onMouseLeave={() => active && setChartPaused(false)}
          onTouchStart={() => active && setChartPaused(true)}
          onTouchEnd={() => active && setChartPaused(false)}
        >
          <CarouselContent>
            <CarouselItem>
              <DataPupr />
            </CarouselItem>
          </CarouselContent>
          {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80 h-6 w-6 md:h-8 md:w-8" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80 h-6 w-6 md:h-8 md:w-8" /> */}
        </Carousel>
        {/* Indikator dot */}
        <div className="mt-3 flex justify-center gap-2 mb-3">
          {chartScrollSnaps.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => chartApi?.scrollTo(idx)}
              className={cn(
                "h-7 min-w-[28px] md:h-8 md:min-w-[32px] px-2 inline-flex items-center justify-center rounded-md border transition-colors font-mono text-xs md:text-sm tabular-nums",
                idx === chartSelectedIndex
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-foreground/70 border-border hover:text-foreground"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </CardComponent>
    </>
  );
}
