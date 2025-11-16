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
import DataStuntingData from "./data/stunting/data-stunting";
import DataStuntingBulan from "./data/stunting/data-stunting-bulan";
import DataStuntingKecamatan from "./data/stunting/data-stunting-kecamatan";
import DataStuntingKecamatanSlide from "./data/stunting/data-stunting-kecamatan-slide";

export default function SectionStunting() {
  // State & kontrol untuk Carousel CHART
  const [chartApi, setChartApi] = React.useState<CarouselApi | null>(null);
  const [chartPaused, setChartPaused] = React.useState(false);
  const chartPausedRef = React.useRef(false);

  React.useEffect(() => {
    chartPausedRef.current = chartPaused;
  }, [chartPaused]);

  // Autoplay setiap 4 detik, berhenti saat hover/touch (CHART)
  React.useEffect(() => {
    if (!chartApi) return;
    const id = setInterval(() => {
      if (!chartPausedRef.current) {
        chartApi.scrollNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [chartApi]);

  const [chartScrollSnaps, setChartScrollSnaps] = React.useState<number[]>([]);
  const [chartSelectedIndex, setChartSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!chartApi) return;
    setChartScrollSnaps(chartApi.scrollSnapList());
    const onSelect = () => setChartSelectedIndex(chartApi.selectedScrollSnap());
    chartApi.on("select", onSelect);
    onSelect();
    return () => {
      chartApi.off("select", onSelect);
    };
  }, [chartApi]);

  return (
    <>
      <CardComponent className="p-0  shadow-lg">
        <Carousel
          className="w-full"
          opts={{ loop: true, align: "start" }}
          setApi={setChartApi}
          onMouseEnter={() => setChartPaused(true)}
          onMouseLeave={() => setChartPaused(false)}
          onTouchStart={() => setChartPaused(true)}
          onTouchEnd={() => setChartPaused(false)}
        >
          <CarouselContent>
            <CarouselItem>
              <DataStuntingData />
            </CarouselItem>
            {/* <CarouselItem>
              <DataStuntingKecamatanSlide />
            </CarouselItem> */}
          </CarouselContent>
        </Carousel>
        {/* Indikator dot */}
        <div className="mt-3 flex justify-center gap-2">
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
      </CardComponent>
    </>
  );
}
