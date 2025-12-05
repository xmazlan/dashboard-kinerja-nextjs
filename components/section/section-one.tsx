"use client";
import React from "react";
import SectionContainer from "./section-container";
import SectionPajakDataSlide from "./roby/slider-content/pajak-slide";
import SectionBpkadDataSlide from "./roby/slider-content/bpkad-slide";
import SectionOrtalDataSlide from "./roby/slider-content/ortal-slide";

export default function SectionOne() {
  const [components, setComponents] = React.useState<
    Array<{ key: string; label: string }>
  >([
    { key: "pajak", label: "Pajak" },
    { key: "bpkad", label: "BPKAD" },
    { key: "ortal", label: "Ortal" },
  ]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/data-search.json`);
        const json = await res.json();
        const sections = Array.isArray(json?.sections) ? json.sections : [];
        const s = sections.find((it: any) => it?.id === "section-one");
        const list = Array.isArray(s?.components) ? s.components : [];
        if (active && list.length > 0) setComponents(list);
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const componentMap: Record<string, React.ComponentType> = {
    pajak: SectionPajakDataSlide,
    bpkad: SectionBpkadDataSlide,
    ortal: SectionOrtalDataSlide,
  };

  return (
    <>
      <SectionContainer idSection={components.map((c) => c.key)}>
        <div className="grid grid-cols-1  gap-4 sm:gap-5">
          {components.map((c) => {
            const Comp = componentMap[c.key];
            if (!Comp) return null;
            return (
              <div
                className="col-span-full sm:col-span-1"
                data-key={c.key}
                key={c.key}
              >
                <Comp />
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </>
  );
}
