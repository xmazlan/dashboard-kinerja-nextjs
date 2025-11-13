import React from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

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

export default function ArticleOne() {
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
            <div className="">
              <CardTitle className="mb-1">Talent Pool</CardTitle>
              <CardDescription>
                Geser untuk melihat 5 visual berbeda per bulan
              </CardDescription>
            </div>
            <div className="text-xs md:text-right text-muted-foreground space-y-1">
              <p>Jumlah Jabatan JA : 100</p>
              <p>Jumlah Dalam Talent : 50</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-1">
          <Carousel
            className="w-full "
            opts={{ loop: true, align: "start" }}
            setApi={setChartApi}
            onMouseEnter={() => setChartPaused(true)}
            onMouseLeave={() => setChartPaused(false)}
            onTouchStart={() => setChartPaused(true)}
            onTouchEnd={() => setChartPaused(false)}
          >
            <CarouselContent>
              {/* Slide 1: Line Chart Target vs Realisasi */}
              <CarouselItem>
                <div className="relative h-[200px] md:h-[300px]">
                  {/* Label sumbu vertikal POTENSIAL */}
                  {/* <div className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] md:text-xs font-semibold tracking-wide text-muted-foreground">
                    POTENSIAL
                  </div> */}

                  {/* Matriks 3x3 + label sumbu horizontal (full width & height) */}
                  <div className="grid grid-cols-[84px_1fr_1fr_1fr] md:grid-cols-[110px_1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_auto] w-full h-full gap-[2px]">
                    {/* Row 1: Potential = Sangat Baik */}
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      SANGAT BAIK 10
                    </div>
                    <div className="bg-yellow-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      POTENSIAL 20
                    </div>
                    <div className="bg-emerald-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      RISING 14
                    </div>
                    <div className="bg-sky-600/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      TOP TALENT&nbsp;<span className="font-bold">35</span>
                    </div>

                    {/* Row 2: Potential = Baik */}
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      BAIK 10
                    </div>
                    <div className="bg-amber-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      INCONSISTENT&nbsp;<span className="font-bold">1</span>
                    </div>
                    <div className="bg-yellow-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      KEY TALENT
                    </div>
                    <div className="bg-green-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      ADAPTABLE&nbsp;<span className="font-bold">144</span>
                    </div>

                    {/* Row 3: Potential = Cukup */}
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      CUKUP
                    </div>
                    <div className="bg-rose-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      MISMATCH&nbsp;<span className="font-bold">4</span>
                    </div>
                    <div className="bg-orange-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      SOLID
                    </div>
                    <div className="bg-slate-800/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      EXPERT
                    </div>

                    {/* Row 4: Label sumbu horizontal PERFORMA */}
                    <div className="bg-transparent"></div>
                    <div className="bg-slate-500 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[32px] md:min-h-[50px]">
                      CUKUP
                    </div>
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[32px] md:min-h-[50px]">
                      BAIK
                    </div>
                    <div className="bg-slate-700 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[32px] md:min-h-[50px]">
                      SANGAT BAIK
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-[200px] md:h-[300px]">
                  {/* Label sumbu vertikal POTENSIAL */}
                  {/* <div className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] md:text-xs font-semibold tracking-wide text-muted-foreground">
                    POTENSIAL
                  </div> */}

                  {/* Matriks 3x3 + label sumbu horizontal (full width & height) */}
                  <div className="grid grid-cols-[84px_1fr_1fr_1fr] md:grid-cols-[110px_1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_auto] w-full h-full gap-[2px]">
                    {/* Row 1: Potential = Sangat Baik */}
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      SANGAT BAIK 10
                    </div>
                    <div className="bg-yellow-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      POTENSIAL 20
                    </div>
                    <div className="bg-emerald-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      RISING 14
                    </div>
                    <div className="bg-sky-600/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      TOP TALENT&nbsp;<span className="font-bold">35</span>
                    </div>

                    {/* Row 2: Potential = Baik */}
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      BAIK 10
                    </div>
                    <div className="bg-amber-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      INCONSISTENT&nbsp;<span className="font-bold">1</span>
                    </div>
                    <div className="bg-yellow-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      KEY TALENT
                    </div>
                    <div className="bg-green-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      ADAPTABLE&nbsp;<span className="font-bold">144</span>
                    </div>

                    {/* Row 3: Potential = Cukup */}
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      CUKUP
                    </div>
                    <div className="bg-rose-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      MISMATCH&nbsp;<span className="font-bold">4</span>
                    </div>
                    <div className="bg-orange-500/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      SOLID
                    </div>
                    <div className="bg-slate-800/90 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[38px] md:min-h-[50px]">
                      EXPERT
                    </div>

                    {/* Row 4: Label sumbu horizontal PERFORMA */}
                    <div className="bg-transparent"></div>
                    <div className="bg-slate-500 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[32px] md:min-h-[50px]">
                      CUKUP
                    </div>
                    <div className="bg-slate-600 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[32px] md:min-h-[50px]">
                      BAIK
                    </div>
                    <div className="bg-slate-700 text-white flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase min-h-[32px] md:min-h-[50px]">
                      SANGAT BAIK
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            {/* <CarouselPrevious className="top-1/2 left-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" />
            <CarouselNext className="top-1/2 right-2 -translate-y-1/2 bg-background/60 backdrop-blur-md border border-border hover:bg-background/80" /> */}
          </Carousel>
          {/* Indikator dot */}
          <div className="mt-2 flex justify-center gap-2">
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
    </>
  );
}
