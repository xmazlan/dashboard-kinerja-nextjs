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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { ModalDetail } from "@/components/modal/detail-modal";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";
export default function DataDisdikKebutuhanGuru() {
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
    <div className="w-full h-full">
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
              <div className="grid grid-cols-1 gap-3">
                <LayoutCard
                  className="relative bg-card rounded-lg shadow-sm p-3 border"
                  ratioDesktop={0.5}
                  ratioMobile={0.38}
                >
                  <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />
                  <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                    Kebutuhan Guru
                  </h3>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barData}
                        margin={{ top: 28, right: 16, bottom: 12, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <YAxis hide domain={[0, "dataMax + 50"]} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <Tooltip
                          formatter={(v: unknown) =>
                            typeof v === "number"
                              ? v.toLocaleString("id-ID")
                              : String(v)
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="value"
                          name="Jumlah"
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                        >
                          <LabelList
                            dataKey="value"
                            position="top"
                            offset={8}
                            formatter={(v: unknown) =>
                              typeof v === "number"
                                ? v.toLocaleString("id-ID")
                                : String(v)
                            }
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
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
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
