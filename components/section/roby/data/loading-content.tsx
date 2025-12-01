import { MorphingSquare } from "@/components/molecule-ui/morphing-square";
import React from "react";

export default function LoadingContent() {
  return (
    <>
      <div className="flex items-center justify-center min-h-[220px] md:min-h-[45vh]">
        <MorphingSquare
          message="Loading..."
          style={{ width: 100, height: 100 }}
        />
      </div>
    </>
  );
}
