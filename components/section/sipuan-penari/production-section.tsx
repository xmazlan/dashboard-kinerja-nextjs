import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// Props
import { type CarouselApi } from "@/components/ui/carousel";
import type { ResponseDataStatistic } from "@/types/sipuan-penari";
// Components
import CardComponent from "@/components/card/card-component";
// Pertanian
import ChartPertanianPalawija from "./chart-pertanian-palawija";
import ChartPertanianFruitVegetableSeason from "./chart-pertanian-fruit-vegetable-season";
import ChartPertanianFruitVegetableYear from "./chart-pertanian-fruit-vegetable-year";
import ChartPertanianBiopharmaceutical from "./chart-pertanian-biopharmaceutical";
import ChartPertanianOrnamental from "./chart-pertanian-ornamental";
// Perkebunan
import ChartPerkebunanProduction from "./chart-perkebunan-production";
// Peternakan
import ChartPeternakanPopulation from "./chart-peternakan-population";
import ChartPeternakanSlaughtered from "./chart-peternakan-slaughtered";
import ChartPeternakanProduction from "./chart-peternakan-production";
import ChartPeternakanVaccination from "./chart-peternakan-vaccination";
// Perikanan
import ChartPerikananSeedCultivation from "./chart-perikanan-seed-cultivation";
import ChartPerikananPondCultivation from "./chart-perikanan-pond-cultivation";
import ChartPerikananCageCultivation from "./chart-perikanan-cage-cultivation";
import ChartPerikananOrnamentalCultivation from "./chart-perikanan-ornamental-cultivation";
import ChartPerikananKUBProduction from "./chart-perikanan-kub-production";
import ChartPerikananUPIFisheryProduct from "./chart-perikanan-upi-fishery-product";

import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// Actions
import {
  getStatisticPertanianAction,
  getStatisticPerkebunanAction,
  getStatisticPeternakanAction,
  getStatisticPerikananAction,
} from "@/actions/SipuanPenariActions";
const SPEED_LIDER = Number(process.env.NEXT_PUBLIC_SPEED_LIDER);
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
  // const [year, setYear] = useState('2023');

  // Chart pertanian state
  const [chartDataPertanian, setChartDataPertanian] = useState<{
    isLoaded: boolean;
    data: ResponseDataStatistic;
  }>({
    isLoaded: false,
    data: {},
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStatisticPertanianAction(
          new URLSearchParams({ year: year }).toString()
        );
        if (res.success) {
          setChartDataPertanian((old) => ({
            ...old,
            data: res.data,
            isLoaded: true,
          }));
        } else {
          // fetchData();
          toast.error("Gagal !", {
            description: res.message || "API Server Error !",
          });
        }
      } catch (error) {
        fetchData();
        if (error instanceof Error) {
          toast.error("Gagal !", {
            description: error.message || "API Server Error !",
          });
        } else {
          console.log("Unknown error:", error);
        }
      }
    };
    fetchData();
  }, []);

  // Chart perkebunan state
  const [chartDataPerkebunan, setChartDataPerkebunan] = useState<{
    isLoaded: boolean;
    data: ResponseDataStatistic;
  }>({
    isLoaded: false,
    data: {},
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStatisticPerkebunanAction(
          new URLSearchParams({ year: year }).toString()
        );
        if (res.success) {
          setChartDataPerkebunan((old) => ({
            ...old,
            data: res.data,
            isLoaded: true,
          }));
        } else {
          // fetchData();
          toast.error("Gagal !", {
            description: res.message || "API Server Error !",
          });
        }
      } catch (error) {
        fetchData();
        if (error instanceof Error) {
          toast.error("Gagal !", {
            description: error.message || "API Server Error !",
          });
        } else {
          console.log("Unknown error:", error);
        }
      }
    };
    fetchData();
  }, []);

  // Chart peternakan state
  const [chartDataPeternakan, setChartDataPeternakan] = useState<{
    isLoaded: boolean;
    data: ResponseDataStatistic;
  }>({
    isLoaded: false,
    data: {},
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStatisticPeternakanAction(
          new URLSearchParams({ year: year }).toString()
        );
        if (res.success) {
          setChartDataPeternakan((old) => ({
            ...old,
            data: res.data,
            isLoaded: true,
          }));
        } else {
          // fetchData();
          toast.error("Gagal !", {
            description: res.message || "API Server Error !",
          });
        }
      } catch (error) {
        fetchData();
        if (error instanceof Error) {
          toast.error("Gagal !", {
            description: error.message || "API Server Error !",
          });
        } else {
          console.log("Unknown error:", error);
        }
      }
    };
    fetchData();
  }, []);

  // Chart perikanan state
  const [chartDataPerikanan, setChartDataPerikanan] = useState<{
    isLoaded: boolean;
    data: ResponseDataStatistic;
  }>({
    isLoaded: false,
    data: {},
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStatisticPerikananAction(
          new URLSearchParams({ year: year }).toString()
        );
        if (res.success) {
          setChartDataPerikanan((old) => ({
            ...old,
            data: res.data,
            isLoaded: true,
          }));
        } else {
          // fetchData();
          toast.error("Gagal !", {
            description: res.message || "API Server Error !",
          });
        }
      } catch (error) {
        fetchData();
        if (error instanceof Error) {
          toast.error("Gagal !", {
            description: error.message || "API Server Error !",
          });
        } else {
          console.log("Unknown error:", error);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <CardComponent className="px-0 pt-0 pb-3 shadow-lg">
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
            <ChartPertanianPalawija
              year={year}
              chartData={chartDataPertanian}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPertanianFruitVegetableSeason
              year={year}
              chartData={chartDataPertanian}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPertanianFruitVegetableYear
              year={year}
              chartData={chartDataPertanian}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPertanianBiopharmaceutical
              year={year}
              chartData={chartDataPertanian}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPertanianOrnamental
              year={year}
              chartData={chartDataPertanian}
            />
          </CarouselItem>
          {/* Perkebunan */}
          <CarouselItem>
            <ChartPerkebunanProduction
              year={year}
              chartData={chartDataPerkebunan}
            />
          </CarouselItem>
          {/* Peternakan */}
          <CarouselItem>
            <ChartPeternakanPopulation
              year={year}
              chartData={chartDataPeternakan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPeternakanSlaughtered
              year={year}
              chartData={chartDataPeternakan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPeternakanProduction
              year={year}
              chartData={chartDataPeternakan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPeternakanVaccination
              year={year}
              chartData={chartDataPeternakan}
            />
          </CarouselItem>
          {/* Perikanan */}
          <CarouselItem>
            <ChartPerikananSeedCultivation
              year={year}
              chartData={chartDataPerikanan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPerikananPondCultivation
              year={year}
              chartData={chartDataPerikanan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPerikananCageCultivation
              year={year}
              chartData={chartDataPerikanan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPerikananOrnamentalCultivation
              year={year}
              chartData={chartDataPerikanan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPerikananKUBProduction
              year={year}
              chartData={chartDataPerikanan}
            />
          </CarouselItem>
          <CarouselItem>
            <ChartPerikananUPIFisheryProduct
              year={year}
              chartData={chartDataPerikanan}
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="top-1/2 -left-3 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
        <CarouselNext className="top-1/2 -right-3 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
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
  );
}
