"use client";
import CardComponent from "@/components/card/card-component";
import { useOrtalIkmData } from "@/hooks/query/use-ortal";
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
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";
export default function DataOrtalIkm({
  ratioDesktop = 0.5,
  ratioMobile = 0.38,
}: {
  ratioDesktop?: number;
  ratioMobile?: number;
}) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { data: apiData, isLoading: isLoadingApiData } = useOrtalIkmData();
  const lastGet = apiData?.last_get ?? "";
  const items: Array<{
    tahun?: number | string;
    nilai_interval?: string | number;
    mutu_peData?: string;
  }> = Array.isArray(apiData?.data)
    ? (apiData?.data as Array<{
        tahun?: number | string;
        nilai_interval?: string | number;
        mutu_peData?: string;
      }>)
    : [];

  const points = items.map((it) => ({
    year: String(it?.tahun ?? ""),
    value:
      typeof it?.nilai_interval === "string"
        ? Number(String(it.nilai_interval).replace(",", "."))
        : Number(it?.nilai_interval ?? 0),
    grade: String(it?.mutu_peData ?? ""),
  }));

  const categories = points.map((p) => p.year);
  const series = [{ name: "Nilai", data: points.map((p) => p.value) }];
  const maxVal = Math.max(0, ...points.map((p) => p.value));
  const options = merge(
    barChartOptions(
      Boolean(isDark),
      "IKM",
      lastGet ? `Terakhir ${lastGet}` : null
    ),
    {
      xaxis: {
        categories,
        labels: { rotate: -30, style: { fontSize: "11px" } },
      },
      yaxis: { max: maxVal + 5 },
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
        title="ORTAL IKM "
        description={(() => {
          const last = String(lastGet || "");
          return (
            <>
              Last update: <span suppressHydrationWarning>{last || "-"}</span>
              <br />
              <span className="italic text-xs">(Sumber : ORTAL IKM)</span>
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
                <div className="max-h-full space-y-3">
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <LayoutCard
                        className="relative bg-card rounded-lg shadow-lg p-3 border"
                        ratioDesktop={ratioDesktop}
                        ratioMobile={ratioMobile}
                      >
                        <div className="flex h-full flex-col">
                          <div className="flex-1 min-h-0 overflow-hidden">
                            <BarChart
                              options={options}
                              series={series}
                              type="line"
                              height="100%"
                            />
                          </div>
                        </div>
                      </LayoutCard>

                      <LayoutCard
                        className="relative bg-card rounded-lg shadow-lg p-3 border"
                        ratioDesktop={ratioDesktop}
                        ratioMobile={ratioMobile}
                      >
                        <div className="flex h-full flex-col">
                          <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                            Detail SAKIP
                          </h3>
                          <div className="flex-1 min-h-0 overflow-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tahun</TableHead>
                                  <TableHead>Nilai Interval</TableHead>
                                  <TableHead>Mutu PeData</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {points.map((p, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{p.year}</TableCell>
                                    <TableCell>
                                      {p.value.toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </TableCell>
                                    <TableCell>{p.grade}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
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
