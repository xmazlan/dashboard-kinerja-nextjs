"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useDisdikDoItmData } from "@/hooks/query/use-disdik";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { barChartOptions, pieChartOptions } from "@/lib/apex-chart-options";
import BarChart from "@/components/apexchart/bar-chart";
import { ModalDetail } from "@/components/modal/detail-modal";
import DataDisdikKebutuhanGuru from "./data-disdik-kebutuhan_guru";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";
export default function DataDisdikDoItm({
  ratioDesktop = 0.6,
  ratioMobile = 0.4,
}: {
  ratioDesktop?: number;
  ratioMobile?: number;
}) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { data: apiData, isLoading: isLoadingApiData } = useDisdikDoItmData();
  const lastGet = apiData?.last_get ?? "";
  const [doAsc, setDoAsc] = React.useState(false);
  const [ltmAsc, setLtmAsc] = React.useState(false);
  const [vp, setVp] = React.useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const doRef = React.useRef<HTMLDivElement>(null);
  const ltmRef = React.useRef<HTMLDivElement>(null);
  const [doH, setDoH] = React.useState<number>(320);
  const [ltmH, setLtmH] = React.useState<number>(320);
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const doItems: Array<{
    nama?: string;
    nilai?: number | string;
    tahun?: number | string;
  }> = (apiData?.data?.do ?? []) as Array<{
    nama?: string;
    nilai?: number | string;
    tahun?: number | string;
  }>;
  const ltmItems: Array<{
    nama?: string;
    nilai?: number | string;
    tahun?: number | string;
  }> = (apiData?.data?.ltm ?? []) as Array<{
    nama?: string;
    nilai?: number | string;
    tahun?: number | string;
  }>;
  const doEntries = doItems.map((it) => ({
    label: String(it?.nama ?? ""),
    value: Number(it?.nilai ?? 0),
  }));
  const ltmEntries = ltmItems.map((it) => ({
    label: String(it?.nama ?? ""),
    value: Number(it?.nilai ?? 0),
  }));
  const sum = (arr: { value: number }[]) =>
    arr.reduce((a, c) => a + c.value, 0);
  const sumDO = sum(doEntries);
  const sumLTM = sum(ltmEntries);
  const percent = (v: number, s: number) =>
    s > 0 ? Math.round((v / s) * 100) : 0;
  const doTableData = doItems.map((it) => ({
    label: String(it?.nama ?? ""),
    value: Number(it?.nilai ?? 0),
    tahun: String(it?.tahun ?? ""),
    pct: percent(Number(it?.nilai ?? 0), sumDO),
  }));
  const ltmTableData = ltmItems.map((it) => ({
    label: String(it?.nama ?? ""),
    value: Number(it?.nilai ?? 0),
    tahun: String(it?.tahun ?? ""),
    pct: percent(Number(it?.nilai ?? 0), sumLTM),
  }));
  const doTableSorted = [...doTableData].sort((a, b) =>
    doAsc ? a.value - b.value : b.value - a.value
  );
  const ltmTableSorted = [...ltmTableData].sort((a, b) =>
    ltmAsc ? a.value - b.value : b.value - a.value
  );
  const doChartData = doItems.map((it) => ({
    name: String(it?.nama ?? ""),
    value: Number(it?.nilai ?? 0),
  }));
  const ltmChartData = ltmItems.map((it) => ({
    name: String(it?.nama ?? ""),
    value: Number(it?.nilai ?? 0),
  }));

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
    const updateDo = () => {
      const w = doRef.current?.offsetWidth || window.innerWidth;
      const rootH = rootRef.current?.offsetHeight || window.innerHeight;
      const factor = vp === "xs" || vp === "sm" ? 0.38 : 0.5;
      const maxH = clamp(Math.round(rootH * factor), 240, 600);
      const wH = clamp(Math.round(w * 0.7), 260, 560);
      setDoH(Math.min(wH, maxH));
    };
    const updateLtm = () => {
      const w = ltmRef.current?.offsetWidth || window.innerWidth;
      const rootH = rootRef.current?.offsetHeight || window.innerHeight;
      const factor = vp === "xs" || vp === "sm" ? 0.38 : 0.5;
      const maxH = clamp(Math.round(rootH * factor), 240, 600);
      const wH = clamp(Math.round(w * 0.68), 240, 540);
      setLtmH(Math.min(wH, maxH));
    };
    const doObs = new ResizeObserver(updateDo);
    const ltmObs = new ResizeObserver(updateLtm);
    if (doRef.current) doObs.observe(doRef.current);
    if (ltmRef.current) ltmObs.observe(ltmRef.current);
    updateDo();
    updateLtm();
    return () => {
      doObs.disconnect();
      ltmObs.disconnect();
    };
  }, [vp]);

  const doCategories = doChartData.map((d) => d.name);
  const doSeries = doChartData.map((d) => d.value);
  const doOptions = merge(
    barChartOptions(
      Boolean(isDark),
      "DO • Chart",
      lastGet ? `Terakhir ${lastGet}` : null
    ),
    {
      xaxis: { labels: { rotate: -50 }, categories: doCategories },
      tooltip: {
        y: { formatter: (val: number) => val.toLocaleString("id-ID") },
      },
      plotOptions: { bar: { distributed: false } },
      chart: { toolbar: { show: false } },
      responsive: [
        {
          breakpoint: 640,
          options: {
            xaxis: { labels: { rotate: -60, style: { fontSize: "10px" } } },
            legend: { show: false },
            chart: { toolbar: { show: false } },
            plotOptions: { bar: { columnWidth: "55%" } },
          },
        },
        {
          breakpoint: 768,
          options: {
            xaxis: { labels: { rotate: -40, style: { fontSize: "11px" } } },
            plotOptions: { bar: { columnWidth: "65%" } },
          },
        },
        {
          breakpoint: 1024,
          options: {
            xaxis: { labels: { rotate: -30, style: { fontSize: "12px" } } },
            plotOptions: { bar: { columnWidth: "60%" } },
          },
        },
      ],
    }
  );

  const ltmLabels = ltmChartData.map((d) => d.name);
  const ltmSeries = ltmChartData.map((d) => d.value);
  const ltmOptions = merge(
    pieChartOptions(
      Boolean(isDark),
      "LTM • Chart",
      lastGet ? `Terakhir ${lastGet}` : null
    ),
    {
      labels: ltmLabels,
      legend: { show: true },
      tooltip: {
        y: { formatter: (val: number) => val.toLocaleString("id-ID") },
      },
      chart: { toolbar: { show: false } },
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
        {
          breakpoint: 1024,
          options: {
            legend: { position: "right" },
            dataLabels: { style: { fontSize: "12px" } },
          },
        },
      ],
    }
  );

  return (
    <>
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Data Disdik DO dan LTM"
        description={(() => {
          const last = String(lastGet || "");
          return (
            <>
              Last update: <span suppressHydrationWarning>{last || "-"}</span>
              <br />
              <span className="italic text-xs">
                (Sumber : Disdik DO (Drop Out) dan LTM (Lulus Tindak
                Melanjutkan))
              </span>
            </>
          );
        })()}
        action={
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            <ModalDetail
              title="Detail Pajak BPHTB"
              description="Tabulasi dan visualisasi detail."
              contentModal={
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold">
                            DO • Tabulasi per Tingkat
                          </div>
                          <div className="text-[10px] opacity-70">
                            Terakhir diperbarui: {lastGet}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-[10px] px-2 py-1 rounded border hover:bg-muted"
                            onClick={() => setDoAsc((v) => !v)}
                          >
                            Urutkan {doAsc ? "Naik" : "Turun"}
                          </button>
                          <div
                            className="text-xs font-bold tabular-nums"
                            suppressHydrationWarning
                          >
                            {sumDO.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <Table className="text-xs">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50%]">Tingkat</TableHead>
                              <TableHead className="w-[20%] text-right">
                                Jumlah
                              </TableHead>

                              <TableHead className="w-[15%] text-right">
                                Tahun
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {doTableSorted.map((it) => (
                              <TableRow
                                key={it.label}
                                className={cn(
                                  getPatternByKey(it.label),
                                  "text-white"
                                )}
                              >
                                <TableCell className="font-medium">
                                  {it.label}
                                </TableCell>
                                <TableCell
                                  className="text-right tabular-nums font-mono"
                                  suppressHydrationWarning
                                >
                                  {it.value.toLocaleString("id-ID")}
                                </TableCell>

                                <TableCell className="text-right">
                                  {it.tahun}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableCaption>Total DO per tingkat</TableCaption>
                        </Table>
                      </div>
                    </div>

                    <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold">
                            LTM • Tabulasi per Jenjang
                          </div>
                          <div className="text-[10px] opacity-70">
                            Terakhir diperbarui: {lastGet}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-[10px] px-2 py-1 rounded border hover:bg-muted"
                            onClick={() => setLtmAsc((v) => !v)}
                          >
                            Urutkan {ltmAsc ? "Naik" : "Turun"}
                          </button>
                          <div
                            className="text-xs font-bold tabular-nums"
                            suppressHydrationWarning
                          >
                            {sumLTM.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <Table className="text-xs">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50%]">Jenjang</TableHead>
                              <TableHead className="w-[20%] text-right">
                                Jumlah
                              </TableHead>

                              <TableHead className="w-[15%] text-right">
                                Tahun
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ltmTableSorted.map((it) => (
                              <TableRow
                                key={it.label}
                                className={cn(
                                  getPatternByKey(it.label),
                                  "text-white"
                                )}
                              >
                                <TableCell className="font-medium">
                                  {it.label}
                                </TableCell>
                                <TableCell
                                  className="text-right tabular-nums font-mono"
                                  suppressHydrationWarning
                                >
                                  {it.value.toLocaleString("id-ID")}
                                </TableCell>

                                <TableCell className="text-right">
                                  {it.tahun}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableCaption>Total LTM per jenjang</TableCaption>
                        </Table>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
          </div>
        }
      >
        {isLoadingApiData ? (
          <LoadingContent />
        ) : (
          (() => {
            return (
              <CardComponent className="shadow-none border-none">
                <div ref={rootRef} className="h-full min-h-0 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <div className="grid-cols-1">
                      <LayoutCard
                        className="relative bg-card rounded-lg shadow-lg p-3 border"
                        ratioDesktop={ratioDesktop}
                        ratioMobile={ratioMobile}
                      >
                        <div className="flex h-full flex-col">
                          <div
                            ref={doRef}
                            className="flex-1 min-h-0 overflow-hidden"
                          >
                            <BarChart
                              options={doOptions}
                              series={[{ name: "Jumlah", data: doSeries }]}
                              type="bar"
                              height="100%"
                            />
                          </div>
                        </div>
                      </LayoutCard>
                    </div>

                    <div className="grid-cols-1">
                      <LayoutCard
                        className="relative bg-card rounded-lg shadow-lg p-3 border"
                        ratioDesktop={ratioDesktop}
                        ratioMobile={ratioMobile}
                      >
                        <div className="flex h-full flex-col">
                          {ltmChartData.length > 0 && (
                            <div
                              ref={ltmRef}
                              className="flex-1 min-h-0 overflow-hidden"
                            >
                              <BarChart
                                options={ltmOptions}
                                series={ltmSeries}
                                type="pie"
                                height="100%"
                              />
                            </div>
                          )}
                          {ltmChartData.length > 0 && (
                            <div className="mt-1.5 space-y-1">
                              {ltmChartData.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-[10px] text-muted-foreground"
                                >
                                  <span className="truncate">{it.name}</span>
                                  <span
                                    className="font-mono"
                                    suppressHydrationWarning
                                  >
                                    {`${it.value.toLocaleString("id-ID")} `}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </LayoutCard>
                    </div>
                  </div>
                </div>
              </CardComponent>
            );
          })()
        )}
      </CardComponent>
    </>
  );
}
