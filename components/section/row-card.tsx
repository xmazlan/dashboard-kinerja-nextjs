import CardComponent from "@/components/card/card-component";
import React from "react";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
const SPEED_LIDER = Number(process.env.NEXT_PUBLIC_SPEED_LIDER);
export default function EmptyRowCard() {
  const [apiTop, setApiTop] = React.useState<CarouselApi | null>(null);
  const [pausedTop, setPausedTop] = React.useState(false);
  const pausedTopRef = React.useRef(false);
  React.useEffect(() => {
    pausedTopRef.current = pausedTop;
  }, [pausedTop]);
  React.useEffect(() => {
    if (!apiTop) return;
    const id = setInterval(() => {
      if (!pausedTopRef.current) apiTop.scrollNext();
    }, SPEED_LIDER);
    return () => clearInterval(id);
  }, [apiTop]);
  const [snapsTop, setSnapsTop] = React.useState<number[]>([]);
  const [selectedTop, setSelectedTop] = React.useState(0);
  React.useEffect(() => {
    if (!apiTop) return;
    setSnapsTop(apiTop.scrollSnapList());
    const onSelect = () => setSelectedTop(apiTop.selectedScrollSnap());
    apiTop.on("select", onSelect);
    onSelect();
    return () => {
      apiTop.off("select", onSelect);
    };
  }, [apiTop]);

  const [apiBottom, setApiBottom] = React.useState<CarouselApi | null>(null);
  const [pausedBottom, setPausedBottom] = React.useState(false);
  const pausedBottomRef = React.useRef(false);
  React.useEffect(() => {
    pausedBottomRef.current = pausedBottom;
  }, [pausedBottom]);
  React.useEffect(() => {
    if (!apiBottom) return;
    const id = setInterval(() => {
      if (!pausedBottomRef.current) apiBottom.scrollNext();
    }, SPEED_LIDER);
    return () => clearInterval(id);
  }, [apiBottom]);
  const [snapsBottom, setSnapsBottom] = React.useState<number[]>([]);
  const [selectedBottom, setSelectedBottom] = React.useState(0);
  React.useEffect(() => {
    if (!apiBottom) return;
    setSnapsBottom(apiBottom.scrollSnapList());
    const onSelect = () => setSelectedBottom(apiBottom.selectedScrollSnap());
    apiBottom.on("select", onSelect);
    onSelect();
    return () => {
      apiBottom.off("select", onSelect);
    };
  }, [apiBottom]);
  return (
    <CardComponent className="rounded-none p-0 border-none w-full h-full">
      <div className="h-full flex flex-col gap-2">
        <div className="flex-1 min-h-0 rounded-md border bg-red-200 overflow-hidden">
          <Carousel
            className="h-full w-full"
            opts={{ loop: true, align: "start" }}
            setApi={setApiTop}
            onMouseEnter={() => setPausedTop(true)}
            onMouseLeave={() => setPausedTop(false)}
            onTouchStart={() => setPausedTop(true)}
            onTouchEnd={() => setPausedTop(false)}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="h-full w-full flex items-center justify-center p-[clamp(8px,2vw,24px)] text-[clamp(12px,1.1vw,18px)] leading-[clamp(18px,1.6vw,28px)] wrap-break-word">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
                  sequi? Accusantium qui voluptatum odio temporibus obcaecati
                  tempora dolore eveniet sunt blanditiis, expedita adipisci,
                  doloremque veritatis cupiditate est ducimus rerum asperiores
                  repellendus. Hic consectetur rerum voluptates et. Quia unde
                  molestiae itaque, reiciendis vitae dicta ea quae tenetur
                  voluptatum cum earum repellat qui voluptatibus error aliquam
                  et amet, atque nulla? Vel, quasi velit obcaecati consectetur
                  minus fuga magni sed, aliquam error incidunt voluptatem
                  possimus deserunt odio nostrum aut, quam alias in nisi. Eius
                  beatae sapiente repellendus aliquid facere iure saepe delectus
                  cum molestias velit. Repudiandae nobis, laborum similique
                  natus exercitationem dolore laudantium. Lorem ipsum dolor, sit
                  amet consectetur adipisicing elit. Soluta aut assumenda quidem
                  reprehenderit, recusandae nisi molestias neque voluptatum
                  aliquid eum voluptates esse quia. Eligendi, ratione dolore.
                  Sed debitis sint ipsa mollitia consequatur illo, perferendis
                  distinctio, veritatis sit perspiciatis nemo exercitationem
                  sunt eligendi nostrum eveniet deserunt magni, beatae est. Eum
                  voluptates vero animi amet numquam? Expedita numquam earum
                  pariatur quo enim dolores sunt cumque eaque doloremque
                  architecto, aspernatur eos facilis quos error. Perferendis
                  distinctio necessitatibus sunt eius, tempora facere laborum
                  temporibus recusandae nisi, ratione doloribus? In ipsam
                  similique consequuntur expedita obcaecati quibusdam, incidunt
                  placeat ipsum molestiae, libero atque, vero quam inventore.
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. A,
                  molestiae? Fugit similique id perferendis delectus, deserunt
                  quam, facilis, illum tempora fuga voluptatum sequi illo porro
                  dolorum expedita optio non alias architecto aperiam ex
                  asperiores? Sit maxime minima illum repellat eos in ipsam
                  quisquam expedita accusamus. Quae labore minus, consequuntur
                  veniam modi, debitis, architecto illum nisi eveniet enim
                  fugiat molestias aliquid. Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. A, molestiae? Fugit similique id
                  perferendis delectus, deserunt quam, facilis, illum tempora
                  fuga voluptatum sequi illo porro dolorum expedita optio non
                  alias architecto aperiam ex asperiores? Sit maxime minima
                  illum repellat eos in ipsam quisquam expedita accusamus. Quae
                  labore minus, consequuntur veniam modi, debitis, architecto
                  illum nisi eveniet enim fugiat molestias aliquid. Lorem ipsum
                  dolor sit, amet consectetur adipisicing elit. Dolorum
                  recusandae ratione nisi reprehenderit harum laborum voluptas
                  eveniet. Rem ipsam impedit, deleniti provident similique
                  natus, magnam nobis quia consequuntur illo voluptatibus.
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="h-full w-full flex items-center justify-center p-[clamp(8px,2vw,24px)] text-[clamp(12px,1.1vw,18px)] leading-[clamp(18px,1.6vw,28px)] wrap-break-word">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
                  sequi? Accusantium qui voluptatum odio temporibus obcaecati
                  tempora dolore eveniet sunt blanditiis, expedita adipisci,
                  doloremque veritatis cupiditate est ducimus rerum asperiores
                  repellendus. Hic consectetur rerum voluptates et. Quia unde
                  molestiae itaque, reiciendis vitae dicta ea quae tenetur
                  voluptatum cum earum repellat qui voluptatibus error aliquam
                  et amet, atque nulla? Vel, quasi velit obcaecati consectetur
                  minus fuga magni sed, aliquam error incidunt voluptatem
                  possimus deserunt odio nostrum aut, quam alias in nisi. Eius
                  beatae sapiente repellendus aliquid facere iure saepe delectus
                  cum molestias velit. Repudiandae nobis, laborum similique
                  natus exercitationem dolore laudantium. Lorem ipsum dolor, sit
                  amet consectetur adipisicing elit. Soluta aut assumenda quidem
                  reprehenderit, recusandae nisi molestias neque voluptatum
                  aliquid eum voluptates esse quia. Eligendi, ratione dolore.
                  Sed debitis sint ipsa mollitia consequatur illo, perferendis
                  distinctio, veritatis sit perspiciatis nemo exercitationem
                  sunt eligendi nostrum eveniet deserunt magni, beatae est. Eum
                  voluptates vero animi amet numquam? Expedita numquam earum
                  pariatur quo enim dolores sunt cumque eaque doloremque
                  architecto, aspernatur eos facilis quos error. Perferendis
                  distinctio necessitatibus sunt eius, tempora facere laborum
                  temporibus recusandae nisi, ratione doloribus? In ipsam
                  similique consequuntur expedita obcaecati quibusdam, incidunt
                  placeat ipsum molestiae, libero atque, vero quam inventore.
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. A,
                  molestiae? Fugit similique id perferendis delectus, deserunt
                  quam, facilis, illum tempora fuga voluptatum sequi illo porro
                  dolorum expedita optio non alias architecto aperiam ex
                  asperiores? Sit maxime minima illum repellat eos in ipsam
                  quisquam expedita accusamus. Quae labore minus, consequuntur
                  veniam modi, debitis, architecto illum nisi eveniet enim
                  fugiat molestias aliquid. Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. A, molestiae? Fugit similique id
                  perferendis delectus, deserunt quam, facilis, illum tempora
                  fuga voluptatum sequi illo porro dolorum expedita optio non
                  alias architecto aperiam ex asperiores? Sit maxime minima
                  illum repellat eos in ipsam quisquam expedita accusamus. Quae
                  labore minus, consequuntur veniam modi, debitis, architecto
                  illum nisi eveniet enim fugiat molestias aliquid. Lorem ipsum
                  dolor sit, amet consectetur adipisicing elit. Dolorum
                  recusandae ratione nisi reprehenderit harum laborum voluptas
                  eveniet. Rem ipsam impedit, deleniti provident similique
                  natus, magnam nobis quia consequuntur illo voluptatibus.
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        <div className="flex justify-center gap-2">
          {snapsTop.map((_, idx) => (
            <button
              key={`top-${idx}`}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => apiTop?.scrollTo(idx)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                idx === selectedTop ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        <div className="flex-1 min-h-0 rounded-md border bg-primary overflow-hidden">
          <Carousel
            className="h-full w-full"
            opts={{ loop: true, align: "start" }}
            setApi={setApiBottom}
            onMouseEnter={() => setPausedBottom(true)}
            onMouseLeave={() => setPausedBottom(false)}
            onTouchStart={() => setPausedBottom(true)}
            onTouchEnd={() => setPausedBottom(false)}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="h-full w-full flex items-center justify-center p-[clamp(8px,2vw,24px)] text-[clamp(12px,1.1vw,18px)] leading-[clamp(18px,1.6vw,28px)] wrap-break-word">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
                  sequi? Accusantium qui voluptatum odio temporibus obcaecati
                  tempora dolore eveniet sunt blanditiis, expedita adipisci,
                  doloremque veritatis cupiditate est ducimus rerum asperiores
                  repellendus. Hic consectetur rerum voluptates et. Quia unde
                  molestiae itaque, reiciendis vitae dicta ea quae tenetur
                  voluptatum cum earum repellat qui voluptatibus error aliquam
                  et amet, atque nulla? Vel, quasi velit obcaecati consectetur
                  minus fuga magni sed, aliquam error incidunt voluptatem
                  possimus deserunt odio nostrum aut, quam alias in nisi. Eius
                  beatae sapiente repellendus aliquid facere iure saepe delectus
                  cum molestias velit. Repudiandae nobis, laborum similique
                  natus exercitationem dolore laudantium. Lorem ipsum dolor, sit
                  amet consectetur adipisicing elit. Soluta aut assumenda quidem
                  reprehenderit, recusandae nisi molestias neque voluptatum
                  aliquid eum voluptates esse quia. Eligendi, ratione dolore.
                  Sed debitis sint ipsa mollitia consequatur illo, perferendis
                  distinctio, veritatis sit perspiciatis nemo exercitationem
                  sunt eligendi nostrum eveniet deserunt magni, beatae est. Eum
                  voluptates vero animi amet numquam? Expedita numquam earum
                  pariatur quo enim dolores sunt cumque eaque doloremque
                  architecto, aspernatur eos facilis quos error. Perferendis
                  distinctio necessitatibus sunt eius, tempora facere laborum
                  temporibus recusandae nisi, ratione doloribus? In ipsam
                  similique consequuntur expedita obcaecati quibusdam, incidunt
                  placeat ipsum molestiae, libero atque, vero quam inventore.
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. A,
                  molestiae? Fugit similique id perferendis delectus, deserunt
                  quam, facilis, illum tempora fuga voluptatum sequi illo porro
                  dolorum expedita optio non alias architecto aperiam ex
                  asperiores? Sit maxime minima illum repellat eos in ipsam
                  quisquam expedita accusamus. Quae labore minus, consequuntur
                  veniam modi, debitis, architecto illum nisi eveniet enim
                  fugiat molestias aliquid. Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. A, molestiae? Fugit similique id
                  perferendis delectus, deserunt quam, facilis, illum tempora
                  fuga voluptatum sequi illo porro dolorum expedita optio non
                  alias architecto aperiam ex asperiores? Sit maxime minima
                  illum repellat eos in ipsam quisquam expedita accusamus. Quae
                  labore minus, consequuntur veniam modi, debitis, architecto
                  illum nisi eveniet enim fugiat molestias aliquid. Lorem ipsum
                  dolor sit, amet consectetur adipisicing elit. Dolorum
                  recusandae ratione nisi reprehenderit harum laborum voluptas
                  eveniet. Rem ipsam impedit, deleniti provident similique
                  natus, magnam nobis quia consequuntur illo voluptatibus.
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="h-full w-full flex items-center justify-center p-[clamp(8px,2vw,24px)] text-[clamp(12px,1.1vw,18px)] leading-[clamp(18px,1.6vw,28px)] wrap-break-word">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
                  sequi? Accusantium qui voluptatum odio temporibus obcaecati
                  tempora dolore eveniet sunt blanditiis, expedita adipisci,
                  doloremque veritatis cupiditate est ducimus rerum asperiores
                  repellendus. Hic consectetur rerum voluptates et. Quia unde
                  molestiae itaque, reiciendis vitae dicta ea quae tenetur
                  voluptatum cum earum repellat qui voluptatibus error aliquam
                  et amet, atque nulla? Vel, quasi velit obcaecati consectetur
                  minus fuga magni sed, aliquam error incidunt voluptatem
                  possimus deserunt odio nostrum aut, quam alias in nisi. Eius
                  beatae sapiente repellendus aliquid facere iure saepe delectus
                  cum molestias velit. Repudiandae nobis, laborum similique
                  natus exercitationem dolore laudantium. Lorem ipsum dolor, sit
                  amet consectetur adipisicing elit. Soluta aut assumenda quidem
                  reprehenderit, recusandae nisi molestias neque voluptatum
                  aliquid eum voluptates esse quia. Eligendi, ratione dolore.
                  Sed debitis sint ipsa mollitia consequatur illo, perferendis
                  distinctio, veritatis sit perspiciatis nemo exercitationem
                  sunt eligendi nostrum eveniet deserunt magni, beatae est. Eum
                  voluptates vero animi amet numquam? Expedita numquam earum
                  pariatur quo enim dolores sunt cumque eaque doloremque
                  architecto, aspernatur eos facilis quos error. Perferendis
                  distinctio necessitatibus sunt eius, tempora facere laborum
                  temporibus recusandae nisi, ratione doloribus? In ipsam
                  similique consequuntur expedita obcaecati quibusdam, incidunt
                  placeat ipsum molestiae, libero atque, vero quam inventore.
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. A,
                  molestiae? Fugit similique id perferendis delectus, deserunt
                  quam, facilis, illum tempora fuga voluptatum sequi illo porro
                  dolorum expedita optio non alias architecto aperiam ex
                  asperiores? Sit maxime minima illum repellat eos in ipsam
                  quisquam expedita accusamus. Quae labore minus, consequuntur
                  veniam modi, debitis, architecto illum nisi eveniet enim
                  fugiat molestias aliquid. Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. A, molestiae? Fugit similique id
                  perferendis delectus, deserunt quam, facilis, illum tempora
                  fuga voluptatum sequi illo porro dolorum expedita optio non
                  alias architecto aperiam ex asperiores? Sit maxime minima
                  illum repellat eos in ipsam quisquam expedita accusamus. Quae
                  labore minus, consequuntur veniam modi, debitis, architecto
                  illum nisi eveniet enim fugiat molestias aliquid. Lorem ipsum
                  dolor sit, amet consectetur adipisicing elit. Dolorum
                  recusandae ratione nisi reprehenderit harum laborum voluptas
                  eveniet. Rem ipsam impedit, deleniti provident similique
                  natus, magnam nobis quia consequuntur illo voluptatibus.
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        <div className="flex justify-center gap-2">
          {snapsBottom.map((_, idx) => (
            <button
              key={`bottom-${idx}`}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => apiBottom?.scrollTo(idx)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                idx === selectedBottom ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </CardComponent>
  );
}
