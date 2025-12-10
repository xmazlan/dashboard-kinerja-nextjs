"use client";
import React from "react";
import SectionContainer from "./section-container";
import DataStuntingKecamatanSlide from "./roby/slider-content/data-stunting-kecamatan-slide";
import SectionCapilDataSlide from "./roby/slider-content/capil-slide";
import SectionDinkesDataSlide from "./roby/slider-content/dinkes-slide";
import DisdikSlide from "./roby/slider-content/disdik-slide";

export default function SectionTwo() {
  const [components, setComponents] = React.useState<
    Array<{ key: string; label: string }>
  >([
    { key: "capil", label: "Capil" },
    { key: "stunting", label: "Stunting" },
    { key: "dinkes", label: "Dinkes" },
    { key: "disdik", label: "Disdik" },
  ]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/data-search.json`);
        const json = await res.json();
        const sections = Array.isArray(json?.sections) ? json.sections : [];
        const s = sections.find((it: any) => it?.id === "section-two");
        const list = Array.isArray(s?.components) ? s.components : [];
        if (active && list.length > 0) setComponents(list);
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const componentMap: Record<string, React.ComponentType> = {
    capil: SectionCapilDataSlide,
    stunting: DataStuntingKecamatanSlide,
    dinkes: SectionDinkesDataSlide,
    disdik: DisdikSlide,
  };

  return (
    <>
      <div data-section="two">
        <SectionContainer idSection={components.map((c) => c.key)}>
          <div className="grid grid-cols-1  gap-4 sm:gap-5">
            {components.map((c) => {
              const Comp = componentMap[c.key];
              if (!Comp) return null;
              return (
                <div className="" data-key={c.key} key={c.key}>
                  <Comp />
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </div>
    </>
  );
}
