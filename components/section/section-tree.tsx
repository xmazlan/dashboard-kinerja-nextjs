"use client";
import React from "react";
import SectionContainer from "./section-container";
import SectionOrtalDataSlide from "./roby/slider-content/ortal-slide";
import SectionTpidKomoditiSlide from "./roby/slider-content/tpid-komditi-slide";
import PuprSlide from "./roby/slider-content/pupr-slide";
import SipuanPenariSlide from "./roby/slider-content/distankan-sipuanpenari-slide";

export default function SectionTree() {
  const [components, setComponents] = React.useState<
    Array<{ key: string; label: string }>
  >([
    { key: "kominfo-erespon", label: "Kominfo E-Respon" },
    { key: "pupr", label: "PUPR" },
    { key: "disdik", label: "Disdik" },
    { key: "sipuan-penari", label: "Sipuan Penari" },
  ]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/data-search.json`);
        const json = await res.json();
        const sections = Array.isArray(json?.sections) ? json.sections : [];
        const s = sections.find((it: any) => it?.id === "section-tree");
        const list = Array.isArray(s?.components) ? s.components : [];
        if (active && list.length > 0) setComponents(list);
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const componentMap: Record<string, React.ComponentType> = {
    "sipuan-penari": SipuanPenariSlide,
    ortal: SectionOrtalDataSlide,
    pupr: PuprSlide,
  };

  return (
    <SectionContainer idSection={components.map((c) => c.key)}>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 w-full">
        {components.map((c) => {
          const Comp = componentMap[c.key];
          if (!Comp) return null;
          return (
            <div className="col-span-full " data-key={c.key} key={c.key}>
              <Comp />
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}
