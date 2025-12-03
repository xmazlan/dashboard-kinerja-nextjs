"use client";
import React from "react";
import dynamic from "next/dynamic";
import CardComponent from "@/components/card/card-component";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";
import merge from "deepmerge";
import { barChartOptions, pieChartOptions } from "@/lib/apex-chart-options";
import { getGradientStyleByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";
import LayoutCard from "@/components/card/layout-card";
import { MorphingSquare } from "@/components/molecule-ui/morphing-square";
import LoadingContent from "../loading-content";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TriwulanItem = { tw: string | number; target: number; total: number };
type PieItem = { Jenis: string; Target: number };

interface Props {
  isLoading: boolean;
  isDark: boolean;
  tahun: string | number;
  totalTarget: number;
  totalRealisasi: number;
  isAboveTarget: boolean;
  pieData: PieItem[];
  pieTotal: number;
  triwulanData: TriwulanItem[];
  formatCurrency: (n: number) => string;
  defaultTooltipFormatter: (value: unknown) => string;
  defaultLabelFormatter: (label: unknown) => string;
}

export default function PajakStatistikContent(props: Props) {
  const {
    isLoading,
    isDark,
    tahun,
    totalTarget,
    totalRealisasi,
    isAboveTarget,
    pieData,
    pieTotal,
    triwulanData,
    formatCurrency,
    defaultTooltipFormatter,
    defaultLabelFormatter,
  } = props;

  const [vp, setVp] = React.useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const pieRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const [pieH, setPieH] = React.useState<number>(280);
  const [barH, setBarH] = React.useState<number>(360);
  const [pieRadius, setPieRadius] = React.useState<number>(90);
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const isMobile = vp === "xs" || vp === "sm";
  const pieMargin = isMobile
    ? { top: 6, right: 6, bottom: 8, left: 6 }
    : { top: 8, right: 8, bottom: 12, left: 8 };
  const barMargin = isMobile
    ? { top: 6, right: 6, bottom: 14, left: 6 }
    : { top: 8, right: 8, bottom: 16, left: 8 };
  React.useEffect(() => {
    const compute = (w: number) =>
      w < 640
        ? "xs"
        : w < 768
        ? "sm"
        : w < 1024
        ? "md"
        : w < 1280
        ? "lg"
        : "xl";
    const update = () => setVp(compute(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  React.useEffect(() => {
    const updatePie = () => {
      const w = pieRef.current?.offsetWidth || window.innerWidth;
      const rootH = rootRef.current?.offsetHeight || window.innerHeight;
      const factor = vp === "xs" || vp === "sm" ? 0.35 : 0.5;
      const maxH = clamp(Math.round(rootH * factor), 180, 520);
      const wH = clamp(Math.round(w * 0.68), 180, 460);
      const h = Math.min(wH, maxH);
      setPieH(h);
      const minDim = Math.min(w, h);
      setPieRadius(clamp(Math.round(minDim * 0.42), 70, 120));
    };
    const updateBar = () => {
      const w = barRef.current?.offsetWidth || window.innerWidth;
      const rootH = rootRef.current?.offsetHeight || window.innerHeight;
      const factor = vp === "xs" || vp === "sm" ? 0.35 : 0.5;
      const maxH = clamp(Math.round(rootH * factor), 220, 540);
      const wH = clamp(Math.round(w * 0.7), 260, 520);
      setBarH(Math.min(wH, maxH));
    };
    const po = new ResizeObserver(updatePie);
    const bo = new ResizeObserver(updateBar);
    if (pieRef.current) po.observe(pieRef.current);
    if (barRef.current) bo.observe(barRef.current);
    updatePie();
    updateBar();
    return () => {
      po.disconnect();
      bo.disconnect();
    };
  }, [vp]);

  const pieLabels = Array.isArray(pieData)
    ? pieData.map((d) => String(d.Jenis))
    : [];
  const pieSeries = Array.isArray(pieData)
    ? pieData.map((d) => Number(d.Target || 0))
    : [];
  const pieOptions = merge(
    pieChartOptions(
      isDark,
      "Distribusi Target",
      typeof tahun !== "undefined" ? `Tahun ${tahun}` : null
    ),
    {
      labels: pieLabels,
      legend: { show: vp !== "xs" },
      tooltip: {
        y: {
          formatter: (val: number) => String(defaultTooltipFormatter(val)),
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            legend: { show: false },
            chart: { toolbar: { show: false } },
            dataLabels: { style: { fontSize: "10px" } },
          },
        },
        {
          breakpoint: 768,
          options: {
            dataLabels: { style: { fontSize: "11px" } },
          },
        },
      ],
    }
  );

  const triwulanCategories = Array.isArray(triwulanData)
    ? triwulanData.map((d) => String(d.tw))
    : [];
  const seriesTarget = Array.isArray(triwulanData)
    ? triwulanData.map((d) => Number(d.target || 0))
    : [];
  const seriesTotal = Array.isArray(triwulanData)
    ? triwulanData.map((d) => Number(d.total || 0))
    : [];
  const barOptions = merge(
    barChartOptions(
      isDark,
      "Perbandingan Target vs Realisasi per Triwulan",
      typeof tahun !== "undefined" ? `Tahun ${tahun}` : null
    ),
    {
      xaxis: { categories: triwulanCategories },
      tooltip: {
        y: {
          formatter: (val: number) => String(defaultTooltipFormatter(val)),
        },
      },
      plotOptions: {
        bar: {
          distributed: false,
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            legend: { show: false },
            chart: { toolbar: { show: false } },
            xaxis: { labels: { rotate: -30, style: { fontSize: "10px" } } },
            plotOptions: { bar: { columnWidth: "55%" } },
          },
        },
        {
          breakpoint: 768,
          options: {
            xaxis: { labels: { rotate: -20, style: { fontSize: "11px" } } },
            plotOptions: { bar: { columnWidth: "65%" } },
          },
        },
      ],
    }
  );

  return (
    <CardComponent className="shadow-none border-none ">
      <div className="">
        <div ref={rootRef} className="mx-auto w-full  h-full min-h-0 ">
          {isLoading ? (
            <>
              <LoadingContent />
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-target")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-bold text-white/90">
                        Total Target
                      </span>
                      <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="text-md sm:text-lg font-bold text-white mb-1">
                      {formatCurrency(totalTarget)}
                    </div>
                    <div className="text-[11px] sm:text-xs text-white/80">
                      Target tahun {tahun}
                    </div>
                  </div>

                  <div
                    className="rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-realisasi")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-bold text-white/90">
                        Total Realisasi
                      </span>
                      <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        {isAboveTarget ? (
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="text-md sm:text-lg font-bold text-white mb-1">
                      {formatCurrency(totalRealisasi)}
                    </div>
                    <div className="text-[11px] sm:text-xs text-white/80">
                      Realisasi tahun {tahun}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 ">
                  <LayoutCard
                    className="relative bg-card rounded-lg shadow-lg p-3 border"
                    ratioDesktop={0.5}
                    ratioMobile={0.38}
                  >
                    <div className="flex h-full flex-col">
                      {Array.isArray(pieData) && pieData.length > 0 && (
                        <div
                          ref={pieRef}
                          className="flex-1 min-h-0 overflow-hidden"
                          style={{ height: `${pieH + 64}px` }}
                        >
                          <ApexChart
                            options={pieOptions}
                            series={pieSeries}
                            type="pie"
                            width="100%"
                            height="100%"
                          />
                        </div>
                      )}
                      {Array.isArray(pieData) && pieData.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {pieData.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-[11px] text-muted-foreground"
                            >
                              <span className="truncate">{it.Jenis}</span>
                              <span className="font-mono">
                                {(() => {
                                  const val = Number(it.Target || 0);
                                  const total = Number(pieTotal || 0);
                                  const pct =
                                    total > 0 ? (val / total) * 100 : 0;
                                  return `${formatCurrency(val)} (${pct.toFixed(
                                    2
                                  )} %)`;
                                })()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </LayoutCard>

                  <LayoutCard
                    className="relative bg-card rounded-lg shadow-lg p-3 border"
                    ratioDesktop={0.5}
                    ratioMobile={0.38}
                  >
                    <div className="flex h-full flex-col">
                      {Array.isArray(triwulanData) &&
                        triwulanData.length > 0 && (
                          <div
                            ref={barRef}
                            className="flex-1 min-h-0 overflow-hidden"
                            style={{ height: `${barH + 64}px` }}
                          >
                            <ApexChart
                              options={barOptions}
                              series={[
                                { name: "Target", data: seriesTarget },
                                { name: "Realisasi", data: seriesTotal },
                              ]}
                              type="bar"
                              width="100%"
                              height="100%"
                            />
                          </div>
                        )}
                    </div>
                  </LayoutCard>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CardComponent>
  );
}
