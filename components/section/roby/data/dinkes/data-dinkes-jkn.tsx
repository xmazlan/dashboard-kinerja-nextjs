"use client";

import CardComponent from "@/components/card/card-component";
import LayoutCard from "@/components/card/layout-card";
import BarChart from "@/components/apexchart/bar-chart";
import LoadingContent from "../loading-content";
import { useDinkesJknData } from "@/hooks/query/use-dinkes";
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { barChartOptions } from "@/lib/apex-chart-options";
import { cn } from "@/lib/utils";
import { COLOR_PATTERNS } from "@/components/patern-collor";

type JknItem = {
  bulan?: number;
  tahun?: number;
  penduduk?: number;
  jumlah_peserta_jkn?: number;
  jumlah_persentase?: number;
  keaktifan?: number;
};

const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const JKN_PENDUDUK_PATTERN = COLOR_PATTERNS[0];
const JKN_PESERTA_PATTERN = COLOR_PATTERNS[12];
const JKN_CAKUPAN_PATTERN = COLOR_PATTERNS[22];
const JKN_KEAKTIFAN_PATTERN = COLOR_PATTERNS[32];

export default function DataDinkesJkn({
  ratioDesktop = 0.5,
  ratioMobile = 0.38,
}: {
  ratioDesktop?: number;
  ratioMobile?: number;
}) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const { data: apiData, isLoading: isLoadingApiData } = useDinkesJknData();
  const lastGet = apiData?.last_get ?? "";

  const items: JknItem[] = Array.isArray(apiData?.data)
    ? (apiData.data as JknItem[])
    : [];

  const points = items.map((it) => {
    const monthIndex = (Number(it.bulan) || 0) - 1;
    const monthName =
      monthIndex >= 0 && monthIndex < NAMA_BULAN.length
        ? NAMA_BULAN[monthIndex]
        : String(it.bulan ?? "-");

    return {
      label: `${monthName} ${String(it.tahun ?? "")}`,
      monthLabel: monthName,
      year: String(it.tahun ?? ""),
      penduduk: Number(it.penduduk ?? 0),
      peserta: Number(it.jumlah_peserta_jkn ?? 0),
      cakupan: Number(it.jumlah_persentase ?? 0),
      keaktifan: Number(it.keaktifan ?? 0),
    };
  });

  const categories = points.map((p) => p.monthLabel);

  const pendudukSeries = [
    {
      name: "Penduduk",
      data: points.map((p) => p.penduduk),
    },
  ];

  const pesertaSeries = [
    {
      name: "Peserta JKN",
      data: points.map((p) => p.peserta),
    },
  ];

  const maxPenduduk = Math.max(0, ...points.map((p) => p.penduduk));
  const maxPeserta = Math.max(0, ...points.map((p) => p.peserta));

  const pendudukOptions = merge(
    barChartOptions(
      Boolean(isDark),
      "Total Penduduk per Bulan",
      lastGet ? `Terakhir ${lastGet}` : null
    ),
    {
      xaxis: {
        categories,
        labels: { rotate: -30, style: { fontSize: "11px" } },
      },
      yaxis: {
        min: 0,
        max: maxPenduduk > 0 ? Math.ceil(maxPenduduk * 1.1) : 10,
        labels: {
          formatter: (val: number) =>
            val.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            }),
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) =>
          val.toLocaleString("id-ID", {
            maximumFractionDigits: 0,
          }),
      },
      markers: { size: 3 },
      chart: { toolbar: { show: false } },
      tooltip: {
        y: {
          formatter: (val: number) =>
            val.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            }),
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            xaxis: { labels: { rotate: -45, style: { fontSize: "10px" } } },
            legend: { show: false },
          },
        },
        {
          breakpoint: 1024,
          options: {
            xaxis: { labels: { rotate: -20, style: { fontSize: "12px" } } },
          },
        },
      ],
    }
  );

  const pesertaOptions = merge(
    barChartOptions(
      Boolean(isDark),
      "Total Peserta JKN",
      lastGet ? `Terakhir ${lastGet}` : null
    ),
    {
      xaxis: {
        categories,
        labels: { rotate: -30, style: { fontSize: "11px" } },
      },
      yaxis: {
        min: 0,
        max: maxPeserta > 0 ? Math.ceil(maxPeserta * 1.1) : 10,
        labels: {
          formatter: (val: number) =>
            val.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            }),
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) =>
          val.toLocaleString("id-ID", {
            maximumFractionDigits: 0,
          }),
      },
      markers: { size: 3 },
      chart: { toolbar: { show: false } },
      tooltip: {
        y: {
          formatter: (val: number) =>
            val.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            }),
        },
      },
      responsive: pendudukOptions.responsive,
    }
  );

  const avgCakupan =
    points.length > 0
      ? points.reduce((acc, p) => acc + p.cakupan, 0) / points.length
      : 0;

  const avgKeaktifan =
    points.length > 0
      ? points.reduce((acc, p) => acc + p.keaktifan, 0) / points.length
      : 0;

  const totalPendudukAll = points.reduce((acc, p) => acc + p.penduduk, 0);

  const totalPesertaAll = points.reduce((acc, p) => acc + p.peserta, 0);

  return (
    <>
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="DINKES JKN"
        description={(() => {
          const last = String(lastGet || "");
          return (
            <>
              Last update: <span suppressHydrationWarning>{last || "-"}</span>
              <br />
              <span className="italic text-xs">
                (Sumber : Dinas Kesehatan - JKN)
              </span>
            </>
          );
        })()}
        action={
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5"></div>
        }
      >
        {isLoadingApiData ? (
          <LoadingContent />
        ) : (
          (() => {
            return (
              <CardComponent className="shadow-none border-none">
                <div className="max-h-full space-y-4">
                  <div className="w-full">
                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                      <div className="flex h-full flex-col">
                        <div className="flex-1 min-h-0 overflow-auto">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div
                              className={cn(
                                "rounded-md border p-3 flex flex-col gap-1 text-white",
                                JKN_PENDUDUK_PATTERN
                              )}
                            >
                              <div className="text-xs font-semibold">
                                Total Penduduk
                              </div>
                              <div
                                className="text-2xl font-bold tabular-nums"
                                suppressHydrationWarning
                              >
                                {Number(totalPendudukAll || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </div>
                              <div className="text-[10px] opacity-80">
                                Akumulasi {points.length} bulan data
                              </div>
                            </div>

                            <div
                              className={cn(
                                "rounded-md border p-3 flex flex-col gap-1 text-white",
                                JKN_PESERTA_PATTERN
                              )}
                            >
                              <div className="text-xs font-semibold">
                                Total Peserta JKN
                              </div>
                              <div
                                className="text-2xl font-bold tabular-nums"
                                suppressHydrationWarning
                              >
                                {Number(totalPesertaAll || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </div>
                              <div className="text-[10px] opacity-80">
                                Akumulasi {points.length} bulan data
                              </div>
                            </div>

                            <div
                              className={cn(
                                "rounded-md border p-3 flex flex-col gap-1 text-white",
                                JKN_CAKUPAN_PATTERN
                              )}
                            >
                              <div className="text-xs font-semibold">
                                Cakupan Rata-rata
                              </div>
                              <div
                                className="text-2xl font-bold tabular-nums"
                                suppressHydrationWarning
                              >
                                {avgCakupan.toLocaleString("id-ID", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                %
                              </div>
                              <div className="text-[10px] opacity-80">
                                Berdasarkan {points.length} bulan data
                              </div>
                            </div>

                            <div
                              className={cn(
                                "rounded-md border p-3 flex flex-col gap-1 text-white",
                                JKN_KEAKTIFAN_PATTERN
                              )}
                            >
                              <div className="text-xs font-semibold">
                                Keaktifan Rata-rata
                              </div>
                              <div
                                className="text-2xl font-bold tabular-nums"
                                suppressHydrationWarning
                              >
                                {avgKeaktifan.toLocaleString("id-ID", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                %
                              </div>
                              <div className="text-[10px] opacity-80">
                                Berdasarkan {points.length} bulan data
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <LayoutCard
                        className="relative bg-card rounded-lg shadow-lg p-3 border"
                        ratioDesktop={0.5}
                        ratioMobile={0.38}
                      >
                        <div className="flex h-full flex-col gap-3">
                          {/* <div className="flex-1 min-h-0 overflow-hidden">
                            <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                              Total Penduduk per Bulan
                            </h3>
                            <div className="h-full">
                              <BarChart
                                options={pendudukOptions}
                                series={pendudukSeries}
                                type="line"
                                height="100%"
                              />
                            </div>
                          </div> */}

                          <div className="flex-1 min-h-0 overflow-hidden">
                            <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                              Total Peserta JKN per Bulan
                            </h3>
                            <div className="h-full">
                              <BarChart
                                options={pesertaOptions}
                                series={pesertaSeries}
                                type="bar"
                                height="100%"
                              />
                            </div>
                          </div>
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
