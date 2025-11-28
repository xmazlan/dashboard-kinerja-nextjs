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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { ModalDetail } from "@/components/modal/detail-modal";
import DataDisdikKebutuhanGuru from "./data-disdik-kebutuhan_guru";
export default function DataDisdikDoItm() {
  const { data: apiData, isLoading: isLoadingApiData } = useDisdikDoItmData();
  const lastGet = apiData?.last_get ?? "";
  const [doAsc, setDoAsc] = React.useState(false);
  const [ltmAsc, setLtmAsc] = React.useState(false);
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

  const AxisTick = (props: any) => {
    const { x, y, payload } = props;
    const label = String(payload?.payload?.name ?? payload?.value ?? "");
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          transform="rotate(-45)"
          textAnchor="end"
          fontSize={10}
          fill="#64748b"
          dy={16}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan Disdik DO dan LTM"
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
                          <div className="text-xs font-bold tabular-nums">
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
                                <TableCell className="text-right tabular-nums font-mono">
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
                          <div className="text-xs font-bold tabular-nums">
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
                                <TableCell className="text-right tabular-nums font-mono">
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
          <LoadingSkeleton rows={2} cols={4} />
        ) : (
          (() => {
            return (
              <div className="max-h-full space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
                  <div className="grid-cols-1 lg:col-span-5">
                    <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-3">
                      <ShineBorder
                        shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                      />
                      <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                        DO • Chart
                      </h3>

                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={doChartData}
                            margin={{ top: 8, right: 16, bottom: 50, left: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="name"
                              interval={0}
                              tick={AxisTick}
                            />
                            <Tooltip
                              formatter={(v: unknown) =>
                                typeof v === "number"
                                  ? v.toLocaleString("id-ID")
                                  : String(v)
                              }
                            />
                            {/* <Legend /> */}
                            <Bar
                              dataKey="value"
                              name="Jumlah"
                              fill="#2563eb"
                              radius={[4, 4, 0, 0]}
                            >
                              <LabelList
                                dataKey="value"
                                position="top"
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
                    </div>
                  </div>

                  <div className="grid-cols-1 lg:col-span-2">
                    <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-3">
                      <ShineBorder
                        shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                      />
                      <h3 className="text-xs font-semibold text-foreground mb-2 pb-1 border-b">
                        LTM • Chart
                      </h3>
                      {ltmChartData.length > 0 && (
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={ltmChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                              >
                                {ltmChartData.map((_, i) => {
                                  const palette = [
                                    "#3b82f6",
                                    "#f59e0b",
                                    "#10b981",
                                    "#8b5cf6",
                                    "#ef4444",
                                    "#14b8a6",
                                  ];
                                  return (
                                    <Cell
                                      key={i}
                                      fill={palette[i % palette.length]}
                                    />
                                  );
                                })}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#ffffff",
                                  borderColor: "#e5e7eb",
                                }}
                                itemStyle={{ color: "#334155" }}
                                labelStyle={{ color: "#334155" }}
                              />
                              <Legend
                                wrapperStyle={{
                                  fontSize: "11px",
                                  paddingTop: "12px",
                                  color: "#334155",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
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
                              <span className="font-mono">
                                {`${it.value.toLocaleString("id-ID")} `}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
