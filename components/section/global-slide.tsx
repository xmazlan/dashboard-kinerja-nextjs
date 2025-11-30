import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { useLayoutStore } from "@/hooks/use-layout";
import SectionOne from "./section-one";
import SectionTwo from "./section-two";
import SectionTree from "./section-tree";
import { useDashboardStore } from "@/hooks/use-dashboard";

const SPEED_LIDER = Number(process.env.NEXT_PUBLIC_SPEED_LIDER) || 4000;

type Props = { fullScreen?: boolean; topGap?: number; bottomGap?: number };

export default function GlobSlider({
  fullScreen = true,
  topGap = 12,
  bottomGap = 12,
}: Props) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [paused, setPaused] = React.useState(false);
  const pausedRef = React.useRef(false);
  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  React.useEffect(() => {
    if (!api) return;
    const speed = useDashboardStore.getState().speed || SPEED_LIDER;
    const id = setInterval(() => {
      if (!pausedRef.current) api.scrollNext();
    }, speed);
    return () => clearInterval(id);
  }, [api]);

  const [snaps, setSnaps] = React.useState<number[]>([]);
  const [selected, setSelected] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const images = [
    { src: "/assets/profile-bg.jpg", alt: "Profil" },
    { src: "/assets/poster.png", alt: "Poster" },
    { src: "/assets/p1.png", alt: "Infografis" },
  ];

  const sectionSize = useLayoutStore((s) => s.section);
  const viewportSize = useLayoutStore((s) => s.viewport);
  const navbarSize = useLayoutStore((s) => s.navbar);
  const footerSize = useLayoutStore((s) => s.footer);

  const computedHeight = React.useMemo(() => {
    const sectionH = sectionSize?.height ?? 0;
    if (sectionH > 0) return `${sectionH}px`;
    const vh = viewportSize?.height ?? 0;
    const nh = navbarSize?.height ?? 0;
    const fh = footerSize?.height ?? 0;
    const available = Math.max(vh - nh - fh, 240);
    if (available > 0) return `${available}px`;
    return "480px";
  }, [
    sectionSize?.height,
    viewportSize?.height,
    navbarSize?.height,
    footerSize?.height,
  ]);

  React.useEffect(() => {
    if (!api) return;
    api.reInit();
  }, [api, computedHeight]);

  const topOffset = fullScreen
    ? Math.max((navbarSize?.height ?? 0) + topGap, 0)
    : 0;
  const bottomOffset = fullScreen
    ? Math.max((footerSize?.height ?? 0) + bottomGap, 0)
    : 0;

  return (
    <div
      className={fullScreen ? "fixed inset-0" : "relative w-full h-full"}
      style={{
        height: fullScreen ? "100vh" : computedHeight,
        width: fullScreen ? "100vw" : undefined,
      }}
    >
      <div
        className={
          (fullScreen ? "absolute left-0 right-0" : "relative w-full h-full") +
          " px-4"
        }
        style={
          fullScreen ? { top: topOffset, bottom: bottomOffset } : undefined
        }
      >
        <Carousel
          className="w-full h-full"
          opts={{ loop: true, align: "start" }}
          setApi={setApi}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <CarouselContent>
            {/* {images.map((img, idx) => (
              <CarouselItem key={idx} className="h-full">
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent" />
                </div>
              </CarouselItem>
            ))} */}

            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-auto rounded-md">
                <div className="w-full h-full p-2 md:p-3">
                  <div className="flex h-full min-h-0 items-center justify-center">
                    <SectionOne />
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-auto rounded-md">
                <div className="w-full h-full p-2 md:p-3">
                  <div className="flex h-full min-h-0 items-center justify-center">
                    <SectionTwo />
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-auto rounded-md">
                <div className="w-full h-full p-2 md:p-3">
                  <div className="flex h-full min-h-0 items-center justify-center">
                    <SectionTree />
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white" />
          <CarouselNext className="hidden md:flex right-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white" />
        </Carousel>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {snaps.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => api?.scrollTo(idx)}
              className={
                idx === selected
                  ? "h-2 w-8 rounded-full bg-white"
                  : "h-2 w-2 rounded-full bg-white/50 hover:bg-white/75"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
