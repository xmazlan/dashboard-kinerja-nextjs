import React from "react";
// Components
import SipuanPenariProductionSection from "./sipuan-penari/production-section";

export default function SectionTree() {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2">
        {/* Sipuan Penari : Data Produksi */}
        <SipuanPenariProductionSection />
      </div>
    </div>
  );
}
