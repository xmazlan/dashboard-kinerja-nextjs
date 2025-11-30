"use client";
import React from "react";

export default function ViewportInfo() {
  const [vw, setVw] = React.useState(0);
  const [vh, setVh] = React.useState(0);
  const [mw, setMw] = React.useState(0);
  const [mh, setMh] = React.useState(0);
  const [sw, setSw] = React.useState(0);
  const [sh, setSh] = React.useState(0);

  React.useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      const main = document.querySelector("main") as HTMLElement | null;
      const section = document.querySelector(
        "main > section"
      ) as HTMLElement | null;
      if (main) {
        const r = main.getBoundingClientRect();
        setMw(Math.round(r.width));
        setMh(Math.round(r.height));
      }
      if (section) {
        const r = section.getBoundingClientRect();
        setSw(Math.round(r.width));
        setSh(Math.round(r.height));
      }
    };
    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    const main = document.querySelector("main");
    const section = document.querySelector("main > section");
    if (main) ro.observe(main);
    if (section) ro.observe(section);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-2 left-2 z-50 text-[11px] md:text-xs rounded-md bg-black/60 text-white px-2 py-1 shadow">
      <div>
        Viewport: {vw} × {vh}
      </div>
      <div>
        Main: {mw} × {mh}
      </div>
      <div>
        Section: {sw} × {sh}
      </div>
    </div>
  );
}
