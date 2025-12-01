import React from "react";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/hooks/use-layout";

export default function LayoutCard({
  children,
  className,
  ratioDesktop = 0.5,
  ratioMobile = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  ratioDesktop?: number;
  ratioMobile?: number;
}) {
  const viewport = useLayoutStore((s) => s.viewport);
  const section = useLayoutStore((s) => s.section);
  const navbar = useLayoutStore((s) => s.navbar);
  const footer = useLayoutStore((s) => s.footer);
  const isMobile = (viewport?.width ?? 0) < 768;
  const available =
    section?.height && section.height > 0
      ? section.height
      : Math.max(
          (viewport?.height ?? 0) -
            (navbar?.height ?? 0) -
            (footer?.height ?? 0),
          240
        );
  const target = Math.max(
    180,
    Math.round(available * (isMobile ? ratioMobile : ratioDesktop))
  );
  return (
    <div
      className={cn("w-full min-h-0 rounded-lg", className)}
      style={{ height: target }}
    >
      <div className="w-full h-full min-h-0">{children}</div>
    </div>
  );
}
