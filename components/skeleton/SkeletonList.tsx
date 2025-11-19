import React from 'react'
// Components
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonList({ length = 3 }: { length?: number }) {

  const skeletonWidths = ["w-full", "w-3/4", "w-1/2"];

  const renderSkeletonGroup = () => (
    <div className="space-y-4">
      {skeletonWidths.map((width, idx) => (
        <Skeleton key={idx} className={`${width} h-4`} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 text-sm">
      {Array.from({ length: length }).map((_, idx) => (
        <React.Fragment key={idx}>{renderSkeletonGroup()}</React.Fragment>
      ))}
    </div>
  )
}
