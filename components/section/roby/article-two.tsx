import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ArticleTwo() {
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
          <CardTitle>Keterangan Penilaian</CardTitle>
          <CardDescription>
            Geser untuk melihat 5 visual berbeda per bulan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-1">
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
              {/* Slide 1: Line Chart Target vs Realisasi */}
              <CarouselItem>
                <div className="w-full overflow-x-auto">
                  <Table className="w-full text-sm justify-center">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">Kategory</TableHead>
                        <TableHead className="w-[160px]">Range Nilai</TableHead>
                        <TableHead>Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Mismatch</TableCell>
                        <TableCell>0–10</TableCell>
                        <TableCell>Perlu pengembangan signifikan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Inconsistent</TableCell>
                        <TableCell>11–30</TableCell>
                        <TableCell>
                          Perlu pendampingan dan evaluasi berkala
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Solid</TableCell>
                        <TableCell>31–60</TableCell>
                        <TableCell>Performa stabil sesuai ekspektasi</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Key Talent</TableCell>
                        <TableCell>61–80</TableCell>
                        <TableCell>
                          Berpotensi berkembang, siap ditingkatkan
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Expert</TableCell>
                        <TableCell>81–90</TableCell>
                        <TableCell>Keahlian tinggi, menjadi rujukan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top Talent</TableCell>
                        <TableCell>91–100</TableCell>
                        <TableCell>
                          Performa dan potensi sangat tinggi
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    <TableCaption>
                      Klasifikasi penilaian berdasarkan rentang nilai.
                    </TableCaption>
                  </Table>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="w-full overflow-x-auto">
                  <Table className="w-full text-sm justify-center">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">Kategory</TableHead>
                        <TableHead className="w-[160px]">Range Nilai</TableHead>
                        <TableHead>Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Mismatch</TableCell>
                        <TableCell>0–10</TableCell>
                        <TableCell>Perlu pengembangan signifikan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Inconsistent</TableCell>
                        <TableCell>11–30</TableCell>
                        <TableCell>
                          Perlu pendampingan dan evaluasi berkala
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Solid</TableCell>
                        <TableCell>31–60</TableCell>
                        <TableCell>Performa stabil sesuai ekspektasi</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Key Talent</TableCell>
                        <TableCell>61–80</TableCell>
                        <TableCell>
                          Berpotensi berkembang, siap ditingkatkan
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Expert</TableCell>
                        <TableCell>81–90</TableCell>
                        <TableCell>Keahlian tinggi, menjadi rujukan</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top Talent</TableCell>
                        <TableCell>91–100</TableCell>
                        <TableCell>
                          Performa dan potensi sangat tinggi
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    <TableCaption>
                      Klasifikasi penilaian berdasarkan rentang nilai.
                    </TableCaption>
                  </Table>
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
