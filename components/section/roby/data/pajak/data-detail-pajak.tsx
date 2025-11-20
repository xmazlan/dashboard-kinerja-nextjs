import React from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { usePajakStatistikData } from "@/hooks/query/use-pajak";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

type DetailProps = {
  jenispajak?: string | number;
  bulan?: string | number;
  tahun?: string | number;
};

type BulanItem = { tanggal: number | string; total: number };

export default function DataDetailPajak({
  jenispajak,
  bulan,
  tahun,
}: DetailProps) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { data: apiResp, isLoading } = usePajakStatistikData({
    jenispajak,
    bulan,
    tahun,
  });
  const dt = apiResp?.data ?? {};
  const perBulanData: BulanItem[] = Array.isArray(dt?.perBulan?.data)
    ? (dt.perBulan.data as BulanItem[])
    : [];

  const monthNames = [
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
  const monthLabel = monthNames[Number(bulan) - 1] ?? "";

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);
  const defaultTooltipFormatter = (value: unknown) =>
    typeof value === "number"
      ? formatNumber(value)
      : formatNumber(Number(value));
  const dailyLabelFormatter = (label: unknown) => {
    if (typeof label === "number") return `${label} ${monthLabel} ${tahun}`;
    const d = new Date(String(label));
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="bg-card rounded-xl shadow-lg p-4 border">
        <h3 className="text-base font-semibold text-foreground mb-3 pb-2 border-b">
          Kalender Harian - {monthLabel} {tahun}
        </h3>
        {isLoading ? (
          <div className="w-full">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => (
                <Skeleton key={i} className="min-h-[56px] rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          Array.isArray(perBulanData) &&
          perBulanData.length > 0 &&
          (() => {
            const y = Number(tahun);
            const m = Number(bulan);
            const start = new Date(y, m - 1, 1);
            const daysInMonth = new Date(y, m, 0).getDate();
            const offset = (start.getDay() + 6) % 7;
            const headers = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
            const values: Record<number, number> = {};
            perBulanData.forEach((row: BulanItem) => {
              const day =
                typeof row.tanggal === "number"
                  ? row.tanggal
                  : new Date(String(row.tanggal)).getDate();
              values[day] = Number(row.total || 0);
            });
            const cells = Array.from(
              { length: offset + daysInMonth },
              (_, i) => {
                const day = i - offset + 1;
                return day >= 1 && day <= daysInMonth ? day : 0;
              }
            );
            const maxValue = Math.max(...Object.values(values));
            return (
              <div className="w-full">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {headers.map((h, i) => (
                    <div
                      key={i}
                      className="text-[11px] font-semibold text-center text-muted-foreground"
                    >
                      {h}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {cells.map((d, i) =>
                    d > 0 ? (
                      <div
                        key={i}
                        className="rounded-lg border p-2 min-h-[56px] flex flex-col transition-all hover:shadow-md cursor-pointer"
                        style={{
                          backgroundColor:
                            values[d] > 0
                              ? `rgba(59, 130, 246, ${
                                  0.2 + (values[d] / (maxValue || 1)) * 0.6
                                })`
                              : isDark ? "#0f172a" : "#f8fafc",
                          borderColor: values[d] > 0 ? "#3b82f6" : isDark ? "#1f2937" : "#e5e7eb",
                        }}
                      >
                        <div className="text-[11px] font-bold text-foreground mb-1">
                          {d}
                        </div>
                        <div className="text-[10px] font-medium text-muted-foreground">
                          {values[d] > 0 ? formatNumber(values[d]) : "-"}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="rounded-lg p-2 min-h-[56px]"
                        style={{ backgroundColor: isDark ? "#0f172a" : "#f8fafc" }}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>

      <div className="bg-card rounded-xl shadow-lg p-4 border">
        <h3 className="text-base font-semibold text-foreground mb-3 pb-2 border-b">
          Tren Harian - {monthLabel} {tahun}
        </h3>
        {isLoading ? (
          <Skeleton className="h-[220px] w-full rounded" />
        ) : (
          Array.isArray(perBulanData) &&
          perBulanData.length > 0 && (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perBulanData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1f2937" : "#e5e7eb"} />
                  <XAxis
                    dataKey="tanggal"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: isDark ? "#e5e7eb" : "#334155" }}
                    tickFormatter={(value) => {
                      if (typeof value === "number") return String(value);
                      const date = new Date(String(value));
                      return String(date.getDate());
                    }}
                  />
                  <Tooltip
                    formatter={defaultTooltipFormatter}
                    labelFormatter={dailyLabelFormatter}
                    contentStyle={{ backgroundColor: isDark ? "#0f172a" : "#ffffff", borderColor: isDark ? "#1f2937" : "#e5e7eb" }}
                    itemStyle={{ color: isDark ? "#e5e7eb" : "#334155" }}
                    labelStyle={{ color: isDark ? "#e5e7eb" : "#334155" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#9333ea"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#9333ea" }}
                    activeDot={{ r: 6 }}
                    name="Total"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        )}
      </div>
    </div>
  );
}
