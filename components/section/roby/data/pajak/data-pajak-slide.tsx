import React from "react";
import CardComponent from "@/components/card/card-component";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

import DataPajakPBJT from "./data-pajak-PBJT";
import DataPajakPBB from "./data-pajak-PBB";
import DataPajakBPHTB from "./data-pajak-BPHTB";
import DataPajakMINERAL from "./data-pajak-MINERAL";
import DataPajakWALET from "./data-pajak-WALET";
import DataPajakREKLAME from "./data-pajak-REKLAME";
import DataPajakAIRBAWAHTANAH from "./data-pajak-AIRBAWAHTANAH";

const SPEED_LIDER = Number(process.env.NEXT_PUBLIC_SPEED_LIDER);

export default function DataPajakSlide() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [paused, setPaused] = React.useState(false);
  const pausedRef = React.useRef(false);

  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        api.scrollNext();
      }
    }, SPEED_LIDER);
    return () => clearInterval(id);
  }, [api]);

  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full h-full">
      <CardComponent className="p-0 shadow-lg w-full h-full">
        <Carousel
          className="w-full"
          opts={{ loop: true, align: "start" }}
          setApi={setApi}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <CarouselContent className="items-stretch">
            <CarouselItem>
              <DataPajakPBJT />
            </CarouselItem>
            <CarouselItem>
              <DataPajakPBB />
            </CarouselItem>
            <CarouselItem>
              <DataPajakBPHTB />
            </CarouselItem>
            <CarouselItem>
              <DataPajakMINERAL />
            </CarouselItem>
            <CarouselItem>
              <DataPajakWALET />
            </CarouselItem>
            <CarouselItem>
              <DataPajakREKLAME />
            </CarouselItem>
            <CarouselItem>
              <DataPajakAIRBAWAHTANAH />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="mt-3 flex justify-center gap-2 mb-3">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => api?.scrollTo(idx)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                idx === selectedIndex ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </CardComponent>
    </div>
  );
}
