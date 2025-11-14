import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
// Props
import { type CarouselApi } from '@/components/ui/carousel';
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
// Pertanian
import CardComponent from "@/components/card/card-component";
import ChartPertanianPalawija from './chart-pertanian-palawija';
import ChartPeranianFruitVegetableSeason from './chart-pertanian-fruit-vegetable-season';
import ChartPeranianFruitVegetableYear from './chart-pertanian-fruit-vegetable-year';
import ChartPeranianBiopharmaceutical from './chart-pertanian-biopharmaceutical';
import ChartPeranianOrnamental from './chart-pertanian-ornamental';
// Perkebunan
import ChartPerkebunanProduction from './chart-perkebunan-production';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
// Actions
import { getStatisticPerkebunanAction, getStatisticPertanianAction } from '@/actions/SipuanPenariActions';

export default function ProductionSection() {

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


  const [year, setYear] = useState(new Date().getFullYear().toString());
  // Chart pertanian state
  const [chartDataPertanian, setChartDataPertanian] = useState<{ isLoaded: boolean, data: ResponseDataStatistic }>({
    isLoaded: false,
    data: {
      palawija: [],
      fruit_vegetable_season: [],
      fruit_vegetable_year: [],
      biopharmaceutical: [],
      ornamental: [],
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStatisticPertanianAction(new URLSearchParams({ year: year }).toString());
        if (res.success) {
          setChartDataPertanian(old => ({ ...old, data: res.data, isLoaded: true }))
        }
        else {
          // addToast({
          //   title: "Gagal !",
          //   description: res.message || 'API Server Error !',
          //   color: "danger",
          //   variant: "flat",
          // });
        }
      }
      catch (error) {
        if (error instanceof Error) {
          // addToast({
          //   title: "Gagal !",
          //   description: error.message || 'API Server Error !',
          //   color: "danger",
          //   variant: "flat",
          // });
        } else {
          console.log('Unknown error:', error)
        }
      }
    }
    fetchData();
  }, []);

  // Chart perkebunan state
  const [chartDataPerkebunan, setChartDataPerkebunan] = useState<{ isLoaded: boolean, data: ResponseDataStatistic }>({
    isLoaded: false,
    data: {
      palawija: [],
      fruit_vegetable_season: [],
      fruit_vegetable_year: [],
      biopharmaceutical: [],
      ornamental: [],
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStatisticPerkebunanAction(new URLSearchParams({ year: year }).toString());
        if (res.success) {
          setChartDataPerkebunan(old => ({ ...old, data: res.data, isLoaded: true }))
        }
        else {
          // addToast({
          //   title: "Gagal !",
          //   description: res.message || 'API Server Error !',
          //   color: "danger",
          //   variant: "flat",
          // });
        }
      }
      catch (error) {
        if (error instanceof Error) {
          // addToast({
          //   title: "Gagal !",
          //   description: error.message || 'API Server Error !',
          //   color: "danger",
          //   variant: "flat",
          // });
        } else {
          console.log('Unknown error:', error)
        }
      }
    }
    fetchData();
  }, []);

  return (
    <CardComponent
      title="Statistik Produksi Data Pertanian, Perkebunan, Peternakan, dan Perikanan"
      description={
        <>
          Geser untuk melihat data bulanan/triwulan per sub sektor <br />
          <span className="italic text-xs">(Sumber : Sipuan Penari Distankan)</span>
        </>
      }
      className="gap-4"
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
          {/* Pertanian */}
          <CarouselItem>
            <ChartPertanianPalawija year={year} chartData={chartDataPertanian} />
          </CarouselItem>
          <CarouselItem>
            <ChartPeranianFruitVegetableSeason year={year} chartData={chartDataPertanian} />
          </CarouselItem>
          <CarouselItem>
            <ChartPeranianFruitVegetableYear year={year} chartData={chartDataPertanian} />
          </CarouselItem>
          <CarouselItem>
            <ChartPeranianBiopharmaceutical year={year} chartData={chartDataPertanian} />
          </CarouselItem>
          <CarouselItem>
            <ChartPeranianOrnamental year={year} chartData={chartDataPertanian} />
          </CarouselItem>
          {/* Perkebunan */}
          <CarouselItem>
            <ChartPerkebunanProduction year={year} chartData={chartDataPerkebunan} />
          </CarouselItem>
          {/* Peternakan */}
          {/* Perikanan */}
        </CarouselContent>
        <CarouselPrevious className="top-1/5 left-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
        <CarouselNext className="top-1/5 right-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
      </Carousel>
      {/* Indikator dot */}
      <div className="mt-2 flex justify-center gap-2">
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
