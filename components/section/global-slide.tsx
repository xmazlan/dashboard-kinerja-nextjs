"use client";
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
import SectionPajakDataSlide from "./roby/slider-content/pajak-slide";
import SectionBpkadDataSlide from "./roby/slider-content/bpkad-slide";
import DisdikSlide from "./roby/slider-content/disdik-slide";
import DataTpidPasarSlide from "./roby/slider-content/data-tpid-pasar-slide";
import SectionCapilDataSlide from "./roby/slider-content/capil-slide";
import SipuanPenariSlide from "./roby/slider-content/distankan-sipuanpenari-slide";

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
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [snaps, setSnaps] = React.useState<number[]>([]);
  const [selected, setSelected] = React.useState(0);
  const didAdvanceRef = React.useRef(false);
  React.useEffect(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    const onSelect = () => {
      setSelected(api.selectedScrollSnap());
      didAdvanceRef.current = false;
    };
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleInnerDone = React.useCallback(() => {
    if (didAdvanceRef.current) return;
    didAdvanceRef.current = true;
    if (!pausedRef.current) api?.scrollNext();
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

  // Selalu render konten; perilaku aktif/autoplay tetap digating oleh 'mounted'

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
          " px-4 md:px-6 py-3 md:py-4"
        }
        style={
          fullScreen
            ? {
                top: mounted ? topOffset : 0,
                bottom: mounted ? bottomOffset : 0,
              }
            : undefined
        }
      >
        <Carousel
          className="w-full h-full py-2"
          opts={{ loop: true, align: "start" }}
          setApi={setApi}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <div className="w-full h-full p-0 flex items-stretch justify-stretch min-h-0 flex-1">
                  <SectionPajakDataSlide
                    onDone={handleInnerDone}
                    fullSize
                    active={mounted && selected === 0}
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <div className="w-full h-full p-0 flex items-stretch justify-stretch min-h-0 flex-1">
                  <SectionBpkadDataSlide
                    onDone={handleInnerDone}
                    fullSize
                    active={mounted && selected === 1}
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <div className="w-full h-full p-0 flex items-stretch justify-stretch min-h-0 flex-1">
                  <DisdikSlide
                    onDone={handleInnerDone}
                    fullSize
                    active={mounted && selected === 2}
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <div className="w-full h-full p-0 flex items-stretch justify-stretch min-h-0 flex-1">
                  <DataTpidPasarSlide
                    onDone={handleInnerDone}
                    fullSize
                    active={mounted && selected === 3}
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <div className="w-full h-full p-0 flex items-stretch justify-stretch min-h-0 flex-1">
                  <SectionCapilDataSlide
                    onDone={handleInnerDone}
                    fullSize
                    active={mounted && selected === 4}
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <div className="w-full h-full p-0 flex items-stretch justify-stretch min-h-0">
                  <SipuanPenariSlide
                    onDone={handleInnerDone}
                    fullSize
                    active={mounted && selected === 5}
                  />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white" />
          <CarouselNext className="hidden md:flex right-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white" />
        </Carousel>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {snaps.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => api?.scrollTo(idx)}
              className={
                idx === selected
                  ? "h-2 w-8 rounded-full bg-gray-800 dark:bg-white"
                  : "h-2 w-2 rounded-full bg-gray-800/50 dark:bg-white/50 hover:bg-gray-800/75 dark:hover:bg-white/75"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
