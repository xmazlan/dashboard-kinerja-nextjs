"use client";
import CardComponent from "@/components/card/card-component";
import { useDinkesHivData } from "@/hooks/query/use-dinkes";
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { barChartOptions } from "@/lib/apex-chart-options";
import BarChart from "@/components/apexchart/bar-chart";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";
import { cn } from "@/lib/utils";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
export default function DataDinkesHiv({
  ratioDesktop = 0.5,
  ratioMobile = 0.38,
}: {
  ratioDesktop?: number;
  ratioMobile?: number;
}) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { data: apiData, isLoading: isLoadingApiData } = useDinkesHivData();
  const lastGet = apiData?.last_get ?? "";
  const items: Array<{
    klasifikasi_pasien?: string;
    jumlah_pasien?: string | number;
    tahun?: number | string;
  }> = Array.isArray(apiData?.data)
    ? (apiData?.data as Array<{
        klasifikasi_pasien?: string;
        jumlah_pasien?: string | number;
        tahun?: number | string;
      }>)
    : [];

  const points = items.map((it) => ({
    label: String(it?.klasifikasi_pasien ?? ""),
    value:
      typeof it?.jumlah_pasien === "string"
        ? Number(String(it.jumlah_pasien).replace(",", "."))
        : Number(it?.jumlah_pasien ?? 0),
    year: String(it?.tahun ?? ""),
  }));

  const categories = points.map((p) => p.label);
  const series = [{ name: "Jumlah Pasien", data: points.map((p) => p.value) }];
  const maxVal = Math.max(0, ...points.map((p) => p.value));
  const options = merge(
    barChartOptions(
      Boolean(isDark),
      "HIV",
      lastGet ? `Terakhir ${lastGet}` : null
    ),
    {
      xaxis: {
        categories,
        labels: { rotate: -30, style: { fontSize: "11px" } },
      },
      yaxis: { min: 0, max: Math.max(0, maxVal + 5) },
      dataLabels: { enabled: true },
      markers: { size: 3 },
      chart: { toolbar: { show: false } },
      tooltip: {
        y: {
          formatter: (val: number) =>
            val.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
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

  return (
    <>
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="DINKES HIV"
        description={(() => {
          const last = String(lastGet || "");
          return (
            <>
              Last update: <span suppressHydrationWarning>{last || "-"}</span>
              <br />
              <span className="italic text-xs">(Sumber : DINKES HIV)</span>
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
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {points.map((p, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "rounded-md border p-2 flex flex-col gap-1 text-white",
                                  getPatternByKey(p.label)
                                )}
                              >
                                <div className="text-xs font-semibold line-clamp-1">
                                  {p.label}
                                </div>
                                <div
                                  className="text-lg font-bold tabular-nums"
                                  suppressHydrationWarning
                                >
                                  {p.value.toLocaleString("id-ID", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  })}
                                </div>
                                <div className="text-[10px] opacity-70">
                                  Tahun: {p.year || "-"}
                                </div>
                              </div>
                            ))}
                            <div
                              className={cn(
                                "rounded-md border p-2 flex flex-col gap-1 text-white",
                                NEUTRAL_PATTERN
                              )}
                            >
                              <div className="text-xs font-semibold">
                                Total Pasien
                              </div>
                              <div
                                className="text-lg font-bold tabular-nums"
                                suppressHydrationWarning
                              >
                                {points
                                  .reduce(
                                    (acc, it) => acc + (Number(it.value) || 0),
                                    0
                                  )
                                  .toLocaleString("id-ID")}
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
                        <div className="flex h-full flex-col">
                          <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                            Klasifikasi Pasien HIV
                          </h3>
                          <div className="flex-1 min-h-0 overflow-hidden">
                            <BarChart
                              options={options}
                              series={series}
                              type="bar"
                              height="100%"
                            />
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
