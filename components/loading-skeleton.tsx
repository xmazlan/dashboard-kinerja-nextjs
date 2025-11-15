import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type LoadingSkeletonProps = {
  variant?: "grid" | "list" | "card";
  rows?: number;
  cols?: number;
  className?: string;
  tileClassName?: string;
  showHeader?: boolean;
  headerLines?: number;
  showIcon?: boolean;
};

function GridSkeleton({
  rows = 2,
  cols = 4,
  className,
  tileClassName,
  showIcon = true,
}: Omit<LoadingSkeletonProps, "variant" | "showHeader" | "headerLines">) {
  const total = rows * cols;
  const tiles = Array.from({ length: total });
  return (
    <div className={cn("grid gap-3 h-full", className)} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {tiles.map((_, idx) => (
        <div key={idx} className={cn("rounded-md p-4 h-full bg-muted/10", tileClassName)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showIcon && <Skeleton className="size-8 rounded-md" />}
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({
  rows = 6,
  className,
  tileClassName,
  showIcon = true,
}: Omit<LoadingSkeletonProps, "variant" | "cols" | "showHeader" | "headerLines">) {
  const items = Array.from({ length: rows });
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((_, idx) => (
        <div key={idx} className={cn("rounded-md p-3 bg-muted/10", tileClassName)}>
          <div className="flex items-center gap-3">
            {showIcon && <Skeleton className="size-8 rounded-md" />}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CardSkeleton({
  rows = 2,
  cols = 3,
  className,
  tileClassName,
  showHeader = true,
  headerLines = 1,
  showIcon = true,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("h-full flex flex-col space-y-3", className)}>
      {showHeader && (
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-5 w-40" />
          <div className="flex items-center gap-2">
            {Array.from({ length: headerLines }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
      )}
      <GridSkeleton rows={rows} cols={cols} tileClassName={tileClassName} showIcon={showIcon} />
    </div>
  );
}

export default function LoadingSkeleton({ variant = "card", ...props }: LoadingSkeletonProps) {
  if (variant === "grid") return <GridSkeleton {...props} /> as any;
  if (variant === "list") return <ListSkeleton {...props} /> as any;
  return <CardSkeleton {...props} />;
}

export { GridSkeleton, ListSkeleton, CardSkeleton };
