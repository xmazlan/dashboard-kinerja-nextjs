"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// Props
import { type CarouselApi } from "@/components/ui/carousel";
import type { ResponseDataStatistic } from "@/types/sipuan-penari";
// Components
import CardComponent from "@/components/card/card-component";
import { useDashboardStore } from "@/hooks/use-dashboard";

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
import ChartPertanianPalawija from "../../sipuan-penari/chart-pertanian-palawija";
import ChartPertanianFruitVegetableSeason from "../../sipuan-penari/chart-pertanian-fruit-vegetable-season";
import ChartPertanianFruitVegetableYear from "../../sipuan-penari/chart-pertanian-fruit-vegetable-year";
import ChartPertanianBiopharmaceutical from "../../sipuan-penari/chart-pertanian-biopharmaceutical";
import ChartPertanianOrnamental from "../../sipuan-penari/chart-pertanian-ornamental";
import ChartPerkebunanProduction from "../../sipuan-penari/chart-perkebunan-production";
import ChartPeternakanPopulation from "../../sipuan-penari/chart-peternakan-population";
import ChartPeternakanSlaughtered from "../../sipuan-penari/chart-peternakan-slaughtered";
import ChartPeternakanProduction from "../../sipuan-penari/chart-peternakan-production";
import ChartPeternakanVaccination from "../../sipuan-penari/chart-peternakan-vaccination";
import ChartPerikananSeedCultivation from "../../sipuan-penari/chart-perikanan-seed-cultivation";
import ChartPerikananPondCultivation from "../../sipuan-penari/chart-perikanan-pond-cultivation";
import ChartPerikananCageCultivation from "../../sipuan-penari/chart-perikanan-cage-cultivation";
import ChartPerikananOrnamentalCultivation from "../../sipuan-penari/chart-perikanan-ornamental-cultivation";
import ChartPerikananKUBProduction from "../../sipuan-penari/chart-perikanan-kub-production";
import ChartPerikananUPIFisheryProduct from "../../sipuan-penari/chart-perikanan-upi-fishery-product";
const SPEED_LIDER = Number(process.env.NEXT_PUBLIC_SPEED_LIDER);
type Props = { onDone?: () => void; fullSize?: boolean; active?: boolean };
export default function SipuanPenariSlide({ onDone, fullSize, active }: Props) {
  // State & kontrol untuk Carousel CHART
  const [chartApi, setChartApi] = React.useState<CarouselApi | null>(null);
  const [chartPaused, setChartPaused] = React.useState(false);
  const chartPausedRef = React.useRef(false);
  const speed = useDashboardStore((s) => s.speed);
  const childSpeed = useDashboardStore((s) => s.childSpeed);

  React.useEffect(() => {
    chartPausedRef.current = chartPaused;
  }, [chartPaused]);

  // Autoplay sesuai pengaturan, berhenti saat hover/touch (CHART)
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
          </Carousel>
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
        </div>
      </CardComponent>
    </>
  );
}
