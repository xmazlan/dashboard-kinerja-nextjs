"use client";
import SectionContainer from "./section-container";
import DataStuntingKecamatanSlide from "./roby/slider-content/data-stunting-kecamatan-slide";
import SectionCapilDataSlide from "./roby/slider-content/capil-slide";
import KominfoEresponSlide from "./roby/slider-content/kominfo-erespon-slide";
import SectionDinkesDataSlide from "./roby/slider-content/dinkes-slide";

export default function SectionTwo() {
  return (
    <>
      <SectionContainer>
        <div className="grid grid-cols-1  gap-4 sm:gap-5">
          <div className="">
            <DataStuntingKecamatanSlide />
          </div>
          <div className="">
            <SectionCapilDataSlide />
          </div>
          <div className="">
            <SectionDinkesDataSlide />
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
