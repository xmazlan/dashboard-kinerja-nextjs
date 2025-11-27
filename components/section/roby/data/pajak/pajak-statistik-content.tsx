"use client";
import React from "react";
import CardComponent from "@/components/card/card-component";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
} from "recharts";
import { getGradientStyleByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";

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

  return (
    <CardComponent className="shadow-none border-none">
      <div className="">
        <div className=" mx-auto space-y-1">
          {isLoading ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
                <div className="grid grid-cols-1 lg:col-span-1 gap-2">
                  <div className="bg-card rounded-lg p-3 border">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-36 mb-1.5" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="bg-card rounded-lg p-3 border">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-36 mb-1.5" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <div className="bg-card rounded-lg p-3 border lg:col-span-1">
                  <Skeleton className="h-5 w-35 mb-2" />
                  <Skeleton className="h-[160px] w-full" />
                  <div className="mt-2 space-y-1">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="bg-card rounded-lg p-3 border lg:col-span-3">
                  <Skeleton className="h-5 w-64 mb-2" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
                <div className="grid grid-cols-1 lg:col-span-2 gap-2">
                  <div
                    className="rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-target")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/90">
                        Total Target
                      </span>
                      <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="text-md font-bold text-white mb-1">
                      {formatCurrency(totalTarget)}
                    </div>
                    <div className="text-[11px] text-white/80">
                      Target tahun {tahun}
                    </div>
                  </div>

                  <div
                    className="rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow"
                    style={getGradientStyleByKey("pajak-realisasi")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/90">
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
                    <div className="text-md font-bold text-white mb-1">
                      {formatCurrency(totalRealisasi)}
                    </div>
                    <div className="text-[11px] text-white/80">
                      Realisasi tahun {tahun}
                    </div>
                  </div>
                </div>

                <div className="relative bg-card rounded-lg shadow-lg lg:col-span-3 p-3 border">
                  <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />

                  <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                    Distribusi Target
                  </h3>
                  {Array.isArray(pieData) && pieData.length > 0 && (
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="Target"
                            nameKey="Jenis"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                          >
                            {pieData.map((_, i) => {
                              const palette = ["#3b82f6", "#f59e0b"];
                              return (
                                <Cell
                                  key={i}
                                  fill={palette[i % palette.length]}
                                />
                              );
                            })}
                          </Pie>
                          <Tooltip
                            formatter={defaultTooltipFormatter}
                            labelFormatter={defaultLabelFormatter}
                            contentStyle={{
                              backgroundColor: isDark ? "#0f172a" : "#ffffff",
                              borderColor: isDark ? "#1f2937" : "#e5e7eb",
                            }}
                            itemStyle={{
                              color: isDark ? "#e5e7eb" : "#334155",
                            }}
                            labelStyle={{
                              color: isDark ? "#e5e7eb" : "#334155",
                            }}
                          />
                          <Legend
                            wrapperStyle={{
                              fontSize: "11px",
                              paddingTop: "12px",
                              color: isDark ? "#e5e7eb" : "#334155",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
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
                              const pct = total > 0 ? (val / total) * 100 : 0;
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

                <div className="relative bg-card rounded-lg shadow-lg p-3 border lg:col-span-3">
                  <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />

                  <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                    Perbandingan Target vs Realisasi per Triwulan
                  </h3>
                  {Array.isArray(triwulanData) && triwulanData.length > 0 && (
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={triwulanData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={isDark ? "#1f2937" : "#e5e7eb"}
                          />
                          <XAxis
                            dataKey="tw"
                            tickLine={false}
                            axisLine={false}
                            tick={{
                              fontSize: 10,
                              fill: isDark ? "#e5e7eb" : "#334155",
                            }}
                          />
                          <Tooltip
                            formatter={defaultTooltipFormatter}
                            labelFormatter={defaultLabelFormatter}
                            contentStyle={{
                              backgroundColor: isDark ? "#0f172a" : "#ffffff",
                              borderColor: isDark ? "#1f2937" : "#e5e7eb",
                            }}
                            itemStyle={{
                              color: isDark ? "#e5e7eb" : "#334155",
                            }}
                            labelStyle={{
                              color: isDark ? "#e5e7eb" : "#334155",
                            }}
                          />
                          <Legend
                            wrapperStyle={{
                              fontSize: "11px",
                              paddingTop: "12px",
                              color: isDark ? "#e5e7eb" : "#334155",
                            }}
                          />
                          <Bar
                            dataKey="target"
                            fill="#f59e0b"
                            radius={[8, 8, 0, 0]}
                            name="Target"
                          />
                          <Bar
                            dataKey="total"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                            name="Realisasi"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CardComponent>
  );
}
