"use client";
import React from "react";
import CardComponent from "@/components/card/card-component";
import LoadingContent from "../loading-content";
import { usePuprData } from "@/hooks/query/use-pupr";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChart from "@/components/apexchart/bar-chart";
import { Button } from "@/components/ui/button";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

export default function DataPupr() {
  const { theme } = useTheme();
  const { data, isLoading } = usePuprData();
  const rightPanelRef = React.useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = React.useState<number>(360);
  const arr = Array.isArray(data?.data)
    ? (data?.data as Array<{
        kecamatan?: string;
        jumlah_pelanggan?: number;
        tahun?: number;
      }>)
    : [];
  const years = Array.from(new Set(arr.map((d) => Number(d.tahun || 0))))
    .filter((y) => y > 0)
    .sort((a, b) => a - b);
  const latestYear = years[years.length - 1] || 0;
  const [activeYear, setActiveYear] = React.useState<number>(latestYear);
  React.useEffect(() => {
    if (latestYear && activeYear !== latestYear) setActiveYear(latestYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestYear]);

  const categories = Array.from(
    new Set(arr.map((d) => String(d.kecamatan || "-")))
  )
    .filter((c) => c !== "-")
    .sort((a, b) => a.localeCompare(b, "id-ID"));
  const series: { name: string; data: number[] }[] = years.map((y) => ({
    name: String(y),
    data: categories.map((kec) => {
      const found = arr.find(
        (d) => String(d.kecamatan || "-") === kec && Number(d.tahun || 0) === y
      );
      return Number(found?.jumlah_pelanggan || 0);
    }),
  }));

  const chartOptions = React.useMemo<ApexOptions>(
    () => ({
      chart: { type: "bar", stacked: false, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
      dataLabels: { enabled: false },
      legend: { position: "top" },
      xaxis: { categories },
      yaxis: { labels: { formatter: (v: number) => String(Math.round(v)) } },
      tooltip: { y: { formatter: (v: number) => `${v} pelanggan` } },
      colors: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"],
      theme: { mode: theme === "dark" ? "dark" : "light" },
    }),
    [categories, theme]
  );

  const tableRows = arr
    .filter((d) => Number(d.tahun || 0) === activeYear)
    .map((d) => ({
      kecamatan: String(d.kecamatan || "-"),
      jumlah: Number(d.jumlah_pelanggan || 0),
    }));
  const totalActive = tableRows.reduce((acc, cur) => acc + cur.jumlah, 0);
  const sortedRows = tableRows.sort((a, b) => b.jumlah - a.jumlah);
  const maxActive = Math.max(0, ...sortedRows.map((r) => r.jumlah));

  React.useEffect(() => {
    const updateHeight = () => {
      const h = rightPanelRef.current?.clientHeight;
      if (h && h > 240) setChartHeight(h);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [sortedRows.length, activeYear, theme]);

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Data PUPR - L2T2"
        description={
          <>
            Last update: {String(data?.last_get || "")}
            <br />
            <span className="italic text-xs">(Sumber: PUPR - L2T2)</span>
          </>
        }
        action={
          years.length > 0 ? (
            <Tabs
              value={String(activeYear)}
              onValueChange={(v) => setActiveYear(Number(v))}
            >
              <TabsList>
                {years.map((y) => (
                  <TabsTrigger key={y} value={String(y)}>
                    {y}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : null
        }
      >
        {isLoading ? (
          <LoadingContent />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-md border bg-card p-2">
              <BarChart
                options={chartOptions}
                series={series}
                type="bar"
                height={chartHeight}
              />
            </div>
            <div ref={rightPanelRef} className="rounded-md border bg-card p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Tahun {activeYear}</div>
                <div className="text-xs text-muted-foreground">
                  Total pelanggan: {totalActive}
                </div>
              </div>
              <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {sortedRows.map((row, idx) => (
                    <div
                      key={`${row.kecamatan}-${idx}`}
                      className="group rounded-md border bg-card p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">
                            {row.kecamatan}
                          </div>
                          <div className="text-lg font-semibold">
                            {row.jumlah}
                          </div>
                        </div>
                        <div className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {activeYear}
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500"
                          style={{
                            width: `${
                              maxActive
                                ? Math.round((row.jumlah / maxActive) * 100)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {sortedRows.length === 0 && (
                    <div className="col-span-full py-2 text-center text-muted-foreground">
                      Data tidak tersedia
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="mt-2 flex justify-end">
                <Button variant="outline" size="sm">
                  Unduh CSV
                </Button>
              </div> */}
            </div>
          </div>
        )}
      </CardComponent>
    </div>
  );
}
