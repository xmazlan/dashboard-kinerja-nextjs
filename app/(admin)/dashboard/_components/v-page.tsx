"use client";

import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";
import SectionOne from "@/components/section/section-one";
import SectionTwo from "@/components/section/section-two";
import ArticleTree from "@/components/section/roby/article-tree";
import SectionTree from "@/components/section/section-tree";

export default function Dashboard() {
  return (
    <>
      <main className="flex-1 mx-auto w-full  px-4 py-4 space-y-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}

        {/* KPI Cards */}
        <SectionOne />

        {/* Charts Grid */}
        <SectionTwo />

        <SectionTree />
      </main>
    </>
  );
}
