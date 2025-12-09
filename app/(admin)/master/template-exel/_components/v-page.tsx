"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { SectionHero } from "@/components/layout/section-hero";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useSession } from "next-auth/react";
import ListDataTemplateExcel from "./list-data";
import axios from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMasterExcelOpdList } from "@/hooks/query/use-master-template-exel-list";
import { toast } from "sonner";

export default function VPageExcelOpd() {
  const { data: excelOpdList, isLoading } = useMasterExcelOpdList();
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
      queryKey: ["master-excel-opd-list", session?.data?.token],
    });
  }, [queryClient, session?.data?.token]);

  const handleDelete = async (id: number) => {
    try {
      const url = `/api/v1/master/excel-opd/${id}`;
      await axios.delete(url, { headers });
      toast.success("Template Excel dihapus");
      invalidate();
    } catch (error) {
      const data = (
        error as {
          response?: { data?: { message?: string } };
        }
      )?.response?.data;
      toast.error(String(data?.message || "Gagal menghapus Template Excel"));
    }
  };
  return (
    <section className="relative ">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="mb-6">
          <SectionHero
            title={`Template Excel OPD`}
            right={
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <NumberTicker
                    value={
                      Array.isArray(excelOpdList?.data)
                        ? excelOpdList!.data.length
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
            <ListDataTemplateExcel
              items={
                Array.isArray(excelOpdList?.data) ? excelOpdList!.data! : []
              }
              loading={isLoading}
              onDelete={handleDelete}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
