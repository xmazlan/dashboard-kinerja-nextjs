"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export type AplikasiTabsOption = {
  id?: number;
  nama_aplikasi?: string;
  slug_aplikasi?: string;
  json_data?: any[];
  file?: string;
  deskripsi?: string | null;
};

export type AplikasiTabsProps = {
  options: AplikasiTabsOption[];
  activeTab: string;
  onTabChange: (value: string) => void;
  content: React.ReactNode;
};

export default function AplikasiTabs({
  options,
  activeTab,
  onTabChange,
  content,
}: AplikasiTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="w-full h-auto sm:h-18 justify-start overflow-x-auto p-1 gap-1 bg-secondary shrink-0">
        {options.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.slug_aplikasi || String(item.id)}
            className="shrink-0"
          >
            {item.nama_aplikasi}
          </TabsTrigger>
        ))}
      </TabsList>

      {options.map((item) => (
        <TabsContent
          key={item.id}
          value={item.slug_aplikasi || String(item.id)}
          className="mt-4 flex-1 min-h-0"
        >
          <Card className="h-full flex flex-col">
            <CardContent className="space-y-4 flex-1 min-h-0 overflow-auto">
              {content}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
