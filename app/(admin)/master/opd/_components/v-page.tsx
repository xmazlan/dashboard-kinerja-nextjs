"use client";
import React from "react";
import FormKinerja from "@/components/admin/form-kinerja";
import { Card } from "@/components/ui/card";
import { SectionHero } from "@/components/layout/section-hero";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useSession } from "next-auth/react";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { useMasterOpdList } from "@/hooks/query/use-master-opd-list";
import ListDataOpd from "./list-data";
import axios from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

export default function VPageOPD() {
  const { data: opdList, isLoading } = useMasterOpdList();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const headers: Record<string, string> = React.useMemo(() => {
    const h: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const token = session?.data?.token;
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [session?.data?.token]);

  const invalidate = React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["master-opd-list", session?.data?.token],
    });
  }, [queryClient, session?.data?.token]);

  const handleCreate = async (data: { opd: string }) => {
    const url = `/api/v1/master/opd`;
    await axios.post(url, data, { headers });
    invalidate();
  };

  const handleUpdate = async (id: number, data: { opd: string }) => {
    const url = `/api/v1/master/opd/${id}`;
    await axios.patch(url, data, { headers });
    invalidate();
  };

  const handleDelete = async (id: number) => {
    const url = `/api/v1/master/opd/${id}`;
    await axios.delete(url, { headers });
    invalidate();
  };
  return (
    <section className="relative ">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="mb-6">
          <SectionHero
            title={`Unggah Data Kinerja`}
            subtitle={`Pengguna: ${String(session?.data?.user?.name || "-")}`}
            right={
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-semibold">.xlsx</div>
                    <div className="text-xs text-muted-foreground">
                      Tipe berkas
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-semibold">
                      <NumberTicker value={2} /> MB
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Batas ukuran
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-3">
          <Card className="p-6">
            <ListDataOpd
              items={
                Array.isArray(opdList?.data) ? (opdList!.data! as any) : []
              }
              loading={isLoading}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
