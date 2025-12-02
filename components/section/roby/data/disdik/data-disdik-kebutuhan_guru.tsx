"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useDisdikKebutuhanGuruData } from "@/hooks/query/use-disdik";
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
import { barChartOptions } from "@/lib/apex-chart-options";
import BarChart from "@/components/apexchart/bar-chart";
import { ModalDetail } from "@/components/modal/detail-modal";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";
export default function DataDisdikKebutuhanGuru() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { data: apiData, isLoading: isLoadingApiData } =
    useDisdikKebutuhanGuruData();
  const lastGet = apiData?.last_get ?? "";
  const items: Array<{
    tingkat?: string;
    jumlah?: number | string;
    tahun?: number | string;
  }> = Array.isArray(apiData?.data)
    ? (apiData?.data as Array<{
        tingkat?: string;
        jumlah?: number | string;
        tahun?: number | string;
      }>)
    : [];
  const barData = items.map((it) => ({
    name: String(it?.tingkat ?? ""),
    value: Number(it?.jumlah ?? 0),
    tahun: String(it?.tahun ?? ""),
  }));
  const sumTotal = barData.reduce(
    (a, c) => a + (Number.isFinite(c.value) ? c.value : 0),
    0
  );
  const pieColors = [
    "#2563eb",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#f97316",
    "#22c55e",
  ];

  return (
    <>
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan Disdik Kebutuhan Guru"
        description={(() => {
          const last = String(lastGet || "");
          return (
            <>
              Last update: <span suppressHydrationWarning>{last || "-"}</span>
              <br />
              <span className="italic text-xs">(Sumber : Kebutuhan Guru)</span>
            </>
          );
        })()}
      >
        {isLoadingApiData ? (
          <LoadingContent />
        ) : (
          (() => {
            return (
              <CardComponent className="shadow-none border-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <LayoutCard
                    className="relative bg-card rounded-lg shadow-sm p-3 border"
                    ratioDesktop={0.5}
                    ratioMobile={0.38}
                  >
                    <div className="flex h-full flex-col">
                      <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                        Kebutuhan Guru
                      </h3>
                      <div className="flex-1 min-h-0 overflow-hidden">
                        {(() => {
                          const maxVal = Math.max(
                            0,
                            ...barData.map((b) => b.value)
                          );
                          const options = merge(
                            barChartOptions(
                              Boolean(isDark),
                              "Kebutuhan Guru",
                              lastGet ? `Terakhir ${lastGet}` : null
                            ),
                            {
                              xaxis: {
                                categories: barData.map((b) => b.name),
                                labels: {
                                  rotate: -45,
                                  style: { fontSize: "11px" },
                                },
                              },
                              yaxis: { max: maxVal + 50 },
                              tooltip: {
                                y: {
                                  formatter: (val: number) =>
                                    val.toLocaleString("id-ID"),
                                },
                              },
                              chart: { toolbar: { show: false } },
                              responsive: [
                                {
                                  breakpoint: 640,
                                  options: {
                                    xaxis: {
                                      labels: {
                                        rotate: -60,
                                        style: { fontSize: "10px" },
                                      },
                                    },
                                    legend: { show: false },
                                  },
                                },
                                {
                                  breakpoint: 768,
                                  options: {
                                    xaxis: {
                                      labels: {
                                        rotate: -40,
                                        style: { fontSize: "11px" },
                                      },
                                    },
                                  },
                                },
                                {
                                  breakpoint: 1024,
                                  options: {
                                    xaxis: {
                                      labels: {
                                        rotate: -30,
                                        style: { fontSize: "12px" },
                                      },
                                    },
                                  },
                                },
                              ],
                            }
                          );
                          const series = [
                            {
                              name: "Jumlah",
                              data: barData.map((b) => b.value),
                            },
                          ];
                          return (
                            <BarChart
                              options={options}
                              series={series}
                              type="bar"
                              height="100%"
                            />
                          );
                        })()}
                      </div>
                    </div>
                    {/* {barData.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {barData.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-md border px-2 py-1 text-[10px] text-muted-foreground"
                        >
                          <span className="truncate max-w-[100px]">
                            {it.name}
                          </span>
                          <span className="font-mono">{`${it.value.toLocaleString(
                            "id-ID"
                          )} (${(sumTotal > 0
                            ? (it.value / sumTotal) * 100
                            : 0
                          ).toFixed(2)} %)`}</span>
                        </div>
                      ))}
                    </div>
                  )} */}
                  </LayoutCard>

                  <LayoutCard
                    className="relative bg-card rounded-lg shadow-sm p-3 border"
                    ratioDesktop={0.5}
                    ratioMobile={0.38}
                  >
                    <div className="flex h-full flex-col">
                      <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                        Detail Kebutuhan Guru
                      </h3>
                      <div className="flex-1 min-h-0 overflow-auto">
                        <Table>
                          <TableCaption>
                            Total: {sumTotal.toLocaleString("id-ID")}
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tingkat</TableHead>
                              <TableHead>Jumlah</TableHead>
                              <TableHead>Tahun</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((it, idx) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  {String(it?.tingkat ?? "")}
                                </TableCell>
                                <TableCell>
                                  {Number(it?.jumlah ?? 0).toLocaleString(
                                    "id-ID"
                                  )}
                                </TableCell>
                                <TableCell>{String(it?.tahun ?? "")}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </LayoutCard>
                </div>
              </CardComponent>
            );
          })()
        )}
      </CardComponent>
    </>
  );
}
