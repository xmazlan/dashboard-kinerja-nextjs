"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { SectionHero } from "@/components/layout/section-hero";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useSession } from "next-auth/react";
import ListDataApplication from "./list-data";
import axios from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMasterApplicationList } from "@/hooks/query/use-master-application-list";

export default function VPageApplication() {
  const { data: applicationList, isLoading } = useMasterApplicationList();
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
      queryKey: ["master-application-list", session?.data?.token],
    });
  }, [queryClient, session?.data?.token]);

  const handleCreate = async (data: {
    nama_aplikasi: string;
    master_opd_id: string;
    deskripsi?: string | null;
  }) => {
    const url = `/api/v1/master/aplikasi`;
    await axios.post(url, data, { headers });
    invalidate();
  };

  const handleUpdate = async (
    id: number,
    data: {
      nama_aplikasi: string;
      master_opd_id: string;
      deskripsi?: string | null;
    }
  ) => {
    const url = `/api/v1/master/aplikasi/${id}`;
    await axios.patch(url, data, { headers });
    invalidate();
  };

  const handleDelete = async (id: number) => {
    const url = `/api/v1/master/aplikasi/${id}`;
    await axios.delete(url, { headers });
    invalidate();
  };
  return (
    <section className="relative ">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="mb-6">
          <SectionHero
            title={`Master Aplikasi`}
            right={
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <NumberTicker
                    value={
                      Array.isArray(applicationList?.data)
                        ? applicationList!.data.length
                        : 0
                    }
                  />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total data
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-3">
          <Card className="p-4">
            <ListDataApplication
              items={
                Array.isArray(applicationList?.data)
                  ? applicationList!.data!
                  : []
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
