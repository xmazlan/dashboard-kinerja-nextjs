import React, { JSX } from "react";
import { cn } from "@/lib/utils";
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
import SectionOne from "@/components/section/section-one";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import SectionContainer from "./section-container";

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
    { unit: "PeData", realisasi: 88, target: 90 },
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

export default function SectionFour() {
  // State & kontrol untuk Carousel CHART
  const [chartApi, setChartApi] = React.useState<CarouselApi | null>(null);
  const [chartPaused, setChartPaused] = React.useState(false);
  const chartPausedRef = React.useRef(false);

  React.useEffect(() => {
    chartPausedRef.current = chartPaused;
  }, [chartPaused]);

  // Autoplay setiap 4 detik, berhenti saat hover/touch (CHART)
  React.useEffect(() => {
    if (!chartApi) return;
    const id = setInterval(() => {
      if (!chartPausedRef.current) {
        chartApi.scrollNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [chartApi]);

  const [chartScrollSnaps, setChartScrollSnaps] = React.useState<number[]>([]);
  const [chartSelectedIndex, setChartSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!chartApi) return;
    setChartScrollSnaps(chartApi.scrollSnapList());
    const onSelect = () => setChartSelectedIndex(chartApi.selectedScrollSnap());
    chartApi.on("select", onSelect);
    onSelect();
    return () => {
      chartApi.off("select", onSelect);
    };
  }, [chartApi]);

  // State & kontrol untuk Carousel NON-CHART (Contoh Carousel)
  const [contentApi, setContentApi] = React.useState<CarouselApi | null>(null);
  const [contentPaused, setContentPaused] = React.useState(false);
  const contentPausedRef = React.useRef(false);

  React.useEffect(() => {
    contentPausedRef.current = contentPaused;
  }, [contentPaused]);

  // Autoplay setiap 4 detik, berhenti saat hover/touch (NON-CHART)
  React.useEffect(() => {
    if (!contentApi) return;
    const id = setInterval(() => {
      if (!contentPausedRef.current) {
        contentApi.scrollNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [contentApi]);

  const [contentScrollSnaps, setContentScrollSnaps] = React.useState<number[]>(
    []
  );
  const [contentSelectedIndex, setContentSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!contentApi) return;
    setContentScrollSnaps(contentApi.scrollSnapList());
    const onSelect = () =>
      setContentSelectedIndex(contentApi.selectedScrollSnap());
    contentApi.on("select", onSelect);
    onSelect();
    return () => {
      contentApi.off("select", onSelect);
    };
  }, [contentApi]);

  const [components, setComponents] = React.useState<
    Array<{ key: string; label: string }>
  >([
    { key: "target-realisasi", label: "Target vs Realisasi" },
    { key: "status-program", label: "Status Program" },
    { key: "produktivitas-unit", label: "Produktivitas Unit" },
    { key: "kehadiran-mingguan", label: "Kehadiran Mingguan" },
  ]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/data-search.json`);
        const json = await res.json();
        const sections = Array.isArray(json?.sections) ? json.sections : [];
        const s = sections.find((it: any) => it?.id === "section-four");
        const list = Array.isArray(s?.components) ? s.components : [];
        if (active && list.length > 0) setComponents(list);
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const blockMap: Record<string, () => JSX.Element> = {
    "target-realisasi": () => (
      <Card data-key="target-realisasi">
        <CardHeader>
          <CardTitle>Target vs Realisasi</CardTitle>
          <CardDescription>
            Geser untuk melihat 5 visual berbeda per bulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel
            className="w-full"
            opts={{ loop: true, align: "start" }}
            setApi={setChartApi}
            onMouseEnter={() => setChartPaused(true)}
            onMouseLeave={() => setChartPaused(false)}
            onTouchStart={() => setChartPaused(true)}
            onTouchEnd={() => setChartPaused(false)}
          >
            <CarouselContent>
              <CarouselItem>
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
              </CarouselItem>
              <CarouselItem>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData.realisasiPerBulan}>
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
              </CarouselItem>
              <CarouselItem>
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CarouselItem>
              <CarouselItem>
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
              </CarouselItem>
              <CarouselItem>
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
                  </LineChart>
                </ResponsiveContainer>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="top-1/2 left-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
            <CarouselNext className="top-1/2 right-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
          </Carousel>
          <div className="mt-3 flex justify-center gap-2">
            {chartScrollSnaps.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Ke slide ${idx + 1}`}
                onClick={() => chartApi?.scrollTo(idx)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  idx === chartSelectedIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    ),
    "status-program": () => (
      <Card data-key="status-program">
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
    ),
    "produktivitas-unit": () => (
      <Card className="lg:col-span-2" data-key="produktivitas-unit">
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
              <XAxis dataKey="unit" stroke="var(--color-muted-foreground)" />
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
    ),
    "kehadiran-mingguan": () => (
      <Card className="lg:col-span-2" data-key="kehadiran-mingguan">
        <CardHeader>
          <CardTitle>Kehadiran Mingguan</CardTitle>
          <CardDescription>Data kehadiran pegawai per minggu</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.kehadiranMingguan}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="minggu" stroke="var(--color-muted-foreground)" />
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
    ),
  };

  return (
    <>
      <SectionContainer idSection={components.map((c) => c.key)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {components.map((c) => {
            const render = blockMap[c.key];
            if (!render) return null;
            return <React.Fragment key={c.key}>{render()}</React.Fragment>;
          })}
        </div>
      </SectionContainer>
    </>
  );
}
