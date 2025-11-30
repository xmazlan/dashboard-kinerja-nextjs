"use client";
import SectionContainer from "./section-container";
import SectionPajakDataSlide from "./roby/slider-content/pajak-slide";
import SectionBpkadDataSlide from "./roby/slider-content/bpkad-slide";

export default function SectionOne() {
  return (
    <>
      <SectionContainer>
        <div className="grid grid-cols-1  gap-4 sm:gap-5">
          <div className="col-span-full sm:col-span-1">
            <SectionPajakDataSlide />
          </div>
          <div className="col-span-full sm:col-span-1">
            <SectionBpkadDataSlide />
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
