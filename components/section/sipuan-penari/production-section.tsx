import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
// Props
import { type CarouselApi } from '@/components/ui/carousel';
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import ChartPertanianPalawija from './chart-pertanian-palawija';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Icons
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
// Actions
import { getStatisticPertanianAction } from '@/actions/SipuanPenariActions';

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
  // Chart state
  const [chartData, setChartData] = useState<{ isLoaded: boolean, data: ResponseDataStatistic }>({
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
          setChartData(old => ({ ...old, data: res.data, isLoaded: true }))
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
    <Card>
      <CardHeader>
        <CardTitle className="tracking-wide text-primary"> Statistik Produksi Data Pertanian, Perkebunan, Peternakan, dan Perikanan </CardTitle>
        <CardDescription>
          Geser untuk melihat data bulanan/triwulan per sub sektor <br />
          <span className="italic text-xs">(Sumber : Sipuan Penari Distankan)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <ChartPertanianPalawija year={year} chartData={chartData} />
            </CarouselItem>
            <CarouselItem>
              <ChartPertanianPalawija year={year} chartData={chartData} />
            </CarouselItem>
          </CarouselContent>
          {/* <CarouselPrevious className="top-1/2 left-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" /> */}
          {/* <CarouselNext className="top-1/2 right-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" /> */}
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
      </CardContent>
    </Card>
  )
}
