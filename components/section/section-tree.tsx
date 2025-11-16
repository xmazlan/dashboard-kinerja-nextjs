import React from "react";
// Components
import SipuanPenariProductionSection from "./sipuan-penari/production-section";
import TPIDSection from "./tpid/view-section";

export default function SectionTree() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="col-span-full md:col-span-4">
        {/* Sipuan Penari : Data Produksi */}
        <SipuanPenariProductionSection />
      </div>
      <div className="col-span-full md:col-span-2">
        {/* TPID : Komoditas dan Pasar */}
        <TPIDSection />
      </div>
      <div className="col-span-full md:col-span-3">
        {/*  */}
        {/* <SipuanPenariProductionSection /> */}
      </div>
      <div className="col-span-full md:col-span-3">
        {/*  */}
        {/* <SipuanPenariProductionSection /> */}
      </div>
    </div>
  );
}
