import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { chunkArray } from '@/lib/chunk-array';
// Props
import { type CarouselApi } from '@/components/ui/carousel';
import type { HargaKomoditasState } from '@/types/tpid';
// Components
import CardComponent from "@/components/card/card-component";
import ViewHargaKomoditas from './view-harga-komoditas';
import { toast } from "sonner"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
// Actions
import { getHargaKomoditasAction } from '@/actions/TPIDActions';

export default function ViewSection() {

  // Harga komoditas state
  const [hargaKomoditas, setHargaKomoditas] = useState<HargaKomoditasState>({
    isLoaded: false,
    data: []
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHargaKomoditasAction();
        if (res.success) {
          setHargaKomoditas(old => ({ ...old, data: res.data, isLoaded: true }))
        }
        else {
          // fetchData();
          toast.error("Gagal !", {
            description: res.message || 'API Server Error !',
          })
        }
      }
      catch (error) {
        fetchData();
        if (error instanceof Error) {
          toast.error("Gagal !", {
            description: error.message || 'API Server Error !'
          })
        } else {
          console.log('Unknown error:', error)
        }
      }
    }
    fetchData();
  }, []);

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
  }, [chartApi, hargaKomoditas]);

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

  // const chunks = chunkArray(hargaKomoditas?.data, 6);
  const chunks = chunkArray(hargaKomoditas.data || [], 6);

  return (
    // <CardComponent className="px-0 pt-0 pb-3">
    <CardComponent
      title="Harga Rata-Rata Pangan Terbaru"
      description={
        <>
          <span className="italic text-xs">(Sumber : TPID Disperindag)</span>
        </>
      }
      className="py-4 px-3 pb-1 shadow-lg"
    >
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
          {/* <ViewHargaKomoditas hargaKomoditas={hargaKomoditas} /> */}
          {chunks.map((group, groupIndex) => (
            <CarouselItem key={groupIndex}>
              <ViewHargaKomoditas items={group} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-6" />
        <CarouselNext className="-right-6" />
      </Carousel>
      {/* Indikator dot */}
      <div className="flex justify-center gap-2 mt-2">
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
