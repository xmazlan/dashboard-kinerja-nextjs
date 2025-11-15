import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
// Props
import { type CarouselApi } from '@/components/ui/carousel';
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import CardComponent from "@/components/card/card-component";
import ChartHargaKomoditas from './chart-harga-komoditas';
import ChartHargaPasar from './chart-harga-pasar';

import { toast } from "sonner"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
// Actions
import { getStatisticPertanianAction, getStatisticPerkebunanAction, getStatisticPeternakanAction, getStatisticPerikananAction } from '@/actions/SipuanPenariActions';

export default function ViewSection() {

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

  // State & kontrol untuk Carousel NON-CHART (Contoh Carousel)
  const [contentApi, setContentApi] = React.useState<CarouselApi | null>(null);
  const [contentPaused, setContentPaused] = React.useState(false);
  const contentPausedRef = React.useRef(false);

  React.useEffect(() => {
    contentPausedRef.current = contentPaused;
  }, [contentPaused]);

  // Autoplay setiap 4 detik, berhenti saat hover/touch (NON-CHART)
  React.useEffect(() => {
    if (!contentApi) return;
    const id = setInterval(() => {
      if (!contentPausedRef.current) {
        contentApi.scrollNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [contentApi]);

  // Year state
  const [year, setYear] = useState(new Date().getFullYear().toString());

  return (
    <CardComponent className="px-0 pt-0 pb-3">
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
          {/* Harga Komoditas */}
          <CarouselItem>
            {/* <ChartHargaKomoditas /> */}
          </CarouselItem>
          {/* Harga Pasar */}
          <CarouselItem>
            {/* <ChartHargaPasar /> */}
          </CarouselItem>
        </CarouselContent>
        {/* <CarouselPrevious className="top-1/5 left-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
        <CarouselNext className="top-1/5 right-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" /> */}
      </Carousel>
      {/* Indikator dot */}
      <div className="flex justify-center gap-2">
        {chartScrollSnaps.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Ke slide ${idx + 1}`}
            onClick={() => chartApi?.scrollTo(idx)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors cursor-pointer",
              idx === chartSelectedIndex
                ? "bg-primary"
                : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </CardComponent>
  )
}
