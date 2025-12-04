"use client";
import React from "react";
// Components
import SipuanPenariProductionSection from "./sipuan-penari/production-section";
import TPIDSection from "./tpid/view-section";
import SectionContainer from "./section-container";
import KominfoEresponSlide from "./roby/slider-content/kominfo-erespon-slide";
import SipuanPenariSlide from "./roby/slider-content/distankan-sipuanpenari-slide";
import DataTpidPasarSlide from "./roby/slider-content/data-tpid-pasar-slide";
import SectionTpidKomoditiSlide from "./roby/slider-content/tpid-komditi-slide";
import DisdikSlide from "./roby/slider-content/disdik-slide";

export default function SectionTree() {
  return (
    <SectionContainer>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 w-full">
        <div className="col-span-full ">
          <KominfoEresponSlide />
        </div>
        <div className="col-span-full ">
          <DisdikSlide />
        </div>
        <div className="col-span-full ">
          {/* <DataTpidPasarSlide /> */}
          <SectionTpidKomoditiSlide />
        </div>
        <div className="col-span-full ">
          <SipuanPenariSlide />
        </div>
      </div>
    </SectionContainer>
  );
}
