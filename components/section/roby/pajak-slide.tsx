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

import DataPajakPBJT from "./data/pajak/data-pajak-PBJT";
import DataPajakPBB from "./data/pajak/data-pajak-PBB";
import DataPajakBPHTB from "./data/pajak/data-pajak-BPHTB";
import DataPajakMINERAL from "./data/pajak/data-pajak-MINERAL";
import DataPajakWALET from "./data/pajak/data-pajak-WALET";
import DataPajakREKLAME from "./data/pajak/data-pajak-REKLAME";
import DataPajakAIRBAWAHTANAH from "./data/pajak/data-pajak-AIRBAWAHTANAH";
import DataDisdikDoItm from "./data/disdik/data-disdik-doitm";
import DataDisdikKebutuhanGuru from "./data/disdik/data-disdik-kebutuhan_guru";
const SPEED_LIDER = Number(process.env.NEXT_PUBLIC_SPEED_LIDER);
export default function SectionPajakDataSlide() {
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
    }, SPEED_LIDER);
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
              <DataDisdikDoItm />
            </CarouselItem>
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
        {/* Indikator Warna */}
        {/* <div className=" rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-sm font-semibold mb-3">Panduan Warna</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-sm ">Realisasi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-500" />
              <span className="text-sm ">Target</span>
            </div>
          </div>
        </div> */}
        {/* Indikator dot */}
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
      </CardComponent>
    </>
  );
}
