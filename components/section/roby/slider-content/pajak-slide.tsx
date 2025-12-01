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

import DataPajakPBJT from "../data/pajak/data-pajak-PBJT";
import DataPajakPBB from "../data/pajak/data-pajak-PBB";
import DataPajakBPHTB from "../data/pajak/data-pajak-BPHTB";
import DataPajakMINERAL from "../data/pajak/data-pajak-MINERAL";
import DataPajakWALET from "../data/pajak/data-pajak-WALET";
import DataPajakREKLAME from "../data/pajak/data-pajak-REKLAME";
import DataPajakAIRBAWAHTANAH from "../data/pajak/data-pajak-AIRBAWAHTANAH";
const SPEED_LIDER = Number(process.env.NEXT_PUBLIC_SPEED_LIDER);
type Props = { onDone?: () => void; fullSize?: boolean; active?: boolean };
export default function SectionPajakDataSlide({
  onDone,
  fullSize,
  active,
}: Props) {
  // State & kontrol untuk Carousel CHART
  const [chartApi, setChartApi] = React.useState<CarouselApi | null>(null);
  const [chartPaused, setChartPaused] = React.useState(false);
  const chartPausedRef = React.useRef(false);

  React.useEffect(() => {
    chartPausedRef.current = chartPaused;
  }, [chartPaused]);

  // Autoplay setiap 4 detik, berhenti saat hover/touch (CHART)
  React.useEffect(() => {
    if (!chartApi || !active) return;
    const id = setInterval(() => {
      if (!chartPausedRef.current) {
        chartApi.scrollNext();
      }
    }, SPEED_LIDER);
    return () => clearInterval(id);
  }, [chartApi, active]);

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
      const id = setTimeout(() => onDone?.(), SPEED_LIDER);
      return () => clearTimeout(id);
    }
  }, [chartApi, active, onDone]);

  return (
    <>
      <CardComponent className="p-0 shadow-lg w-full h-full">
        <div className="flex h-full flex-col">
          <Carousel
            className="w-full flex-1 min-h-0"
            opts={{ loop: true, align: "start" }}
            setApi={setChartApi}
            onMouseEnter={() => active && setChartPaused(true)}
            onMouseLeave={() => active && setChartPaused(false)}
            onTouchStart={() => active && setChartPaused(true)}
            onTouchEnd={() => active && setChartPaused(false)}
          >
            <CarouselContent className="h-full">
              <CarouselItem>
                <DataPajakPBJT />
              </CarouselItem>
              <CarouselItem>
                <DataPajakPBB />
              </CarouselItem>
              <CarouselItem>
                <DataPajakBPHTB />
              </CarouselItem>
              <CarouselItem>
                <DataPajakMINERAL />
              </CarouselItem>
              <CarouselItem>
                <DataPajakWALET />
              </CarouselItem>
              <CarouselItem>
                <DataPajakREKLAME />
              </CarouselItem>
              <CarouselItem>
                <DataPajakAIRBAWAHTANAH />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <div className="mt-3 flex justify-center gap-2 mb-3">
            {chartScrollSnaps.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Ke slide ${idx + 1}`}
                onClick={() => chartApi?.scrollTo(idx)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  idx === chartSelectedIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </CardComponent>
    </>
  );
}
