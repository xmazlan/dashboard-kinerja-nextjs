"use client";
import React from "react";

type Props = {
  width: number;
  height: number;
  children: React.ReactNode;
  mode?: "contain" | "cover" | "native";
};

export default function ScaledViewport({
  width,
  height,
  children,
  mode = "contain",
}: Props) {
  const [scale, setScale] = React.useState(1);
  const [vw, setVw] = React.useState(0);
  const [vh, setVh] = React.useState(0);

  const updateScale = React.useCallback(() => {
    const _vw = window.innerWidth;
    const _vh = window.innerHeight;
    setVw(_vw);
    setVh(_vh);
    const contain = Math.min(_vw / width, _vh / height);
    const cover = Math.max(_vw / width, _vh / height);
    setScale(mode === "cover" ? cover : contain);
  }, [width, height]);

  React.useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {mode === "native" ? (
        <div
          style={{ width: vw, height: vh }}
          className="relative overflow-hidden w-screen h-screen"
        >
          {children}
        </div>
      ) : (
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
          className="relative overflow-hidden"
        >
          {children}
        </div>
      )}
    </div>
  );
}
