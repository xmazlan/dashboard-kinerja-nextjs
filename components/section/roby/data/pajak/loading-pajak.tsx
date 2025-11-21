import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingPajak() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-4 border">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="bg-card rounded-xl p-4 border">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="bg-card rounded-xl p-4 border">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-4 border">
          <Skeleton className="h-5 w-56 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </div>
        <div className="bg-card rounded-xl p-4 border lg:col-span-2">
          <Skeleton className="h-5 w-64 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </div>
      </div>
      <div className="bg-card rounded-xl p-4 border">
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
