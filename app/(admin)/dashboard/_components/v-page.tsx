"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";

// Mock data untuk dashboard
const mockData = {
  kpiCards: [
    {
      id: 1,
      title: "Target Realisasi",
      value: "85%",
      subtitle: "Q4 2024",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      id: 2,
      title: "Tingkat Kehadiran",
      value: "92%",
      subtitle: "November 2024",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: 3,
      title: "Kepuasan Publik",
      value: "78%",
      subtitle: "Bulan ini",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      id: 4,
      title: "Isu Tertunda",
      value: "12",
      subtitle: "Memerlukan perhatian",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ],
  realisasiPerBulan: [
    { bulan: "Jan", target: 80, realisasi: 75 },
    { bulan: "Feb", target: 82, realisasi: 78 },
    { bulan: "Mar", target: 85, realisasi: 82 },
    { bulan: "Apr", target: 88, realisasi: 85 },
    { bulan: "Mei", target: 85, realisasi: 83 },
    { bulan: "Jun", target: 90, realisasi: 87 },
    { bulan: "Jul", target: 92, realisasi: 90 },
    { bulan: "Agu", target: 88, realisasi: 86 },
    { bulan: "Sep", target: 85, realisasi: 84 },
    { bulan: "Okt", target: 87, realisasi: 85 },
    { bulan: "Nov", target: 90, realisasi: 87 },
    { bulan: "Des", target: 92, realisasi: 85 },
  ],
  produktivitasUnit: [
    { unit: "Pelayanan", realisasi: 88, target: 90 },
    { unit: "Administrasi", realisasi: 82, target: 85 },
    { unit: "Keuangan", realisasi: 91, target: 90 },
    { unit: "SDM", realisasi: 79, target: 85 },
    { unit: "Monitoring", realisasi: 86, target: 85 },
  ],
  statusProgram: [
    { name: "Selesai", value: 45, color: "#22c55e" },
    { name: "Berjalan", value: 38, color: "#3b82f6" },
    { name: "Tertunda", value: 12, color: "#f97316" },
    { name: "Belum Dimulai", value: 5, color: "#6b7280" },
  ],
  kehadiranMingguan: [
    { minggu: "W1", hadir: 95, cuti: 3, alfa: 2 },
    { minggu: "W2", hadir: 92, cuti: 5, alfa: 3 },
    { minggu: "W3", hadir: 94, cuti: 4, alfa: 2 },
    { minggu: "W4", hadir: 91, cuti: 6, alfa: 3 },
  ],
};

export default function Dashboard() {
  return (
    <>
      <main className="flex-1 mx-auto w-full  px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}

        {/* KPI Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockData.kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-foreground">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {card.subtitle}
                      </p>
                    </div>
                    <div className={`rounded-lg ${card.bgColor} p-2`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Target vs Realisasi */}
          <Card>
            <CardHeader>
              <CardTitle>Target vs Realisasi</CardTitle>
              <CardDescription>
                Perbandingan target dengan realisasi per bulan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.realisasiPerBulan}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="bulan"
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="realisasi"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Program */}
          <Card>
            <CardHeader>
              <CardTitle>Status Program</CardTitle>
              <CardDescription>Distribusi status program dinas</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockData.statusProgram}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockData.statusProgram.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} program`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-4 space-y-2">
                {mockData.statusProgram.map((status) => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm text-foreground">
                      {status.name}: {status.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Produktivitas Unit */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Produktivitas per Unit</CardTitle>
              <CardDescription>
                Perbandingan realisasi dan target untuk setiap unit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.produktivitasUnit}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="unit"
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="target"
                    fill="var(--color-chart-2)"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="realisasi"
                    fill="var(--color-chart-1)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Kehadiran Mingguan */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Kehadiran Mingguan</CardTitle>
              <CardDescription>
                Data kehadiran pegawai per minggu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.kehadiranMingguan}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="minggu"
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="hadir"
                    fill="var(--color-chart-1)"
                    stackId="a"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="cuti"
                    fill="var(--color-chart-2)"
                    stackId="a"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="alfa"
                    fill="var(--color-destructive)"
                    stackId="a"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
