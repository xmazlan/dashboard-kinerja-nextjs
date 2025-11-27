import * as React from "react";
import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Domain akan ditangkap otomatis oleh axios dari env/hostname,
// sehingga parameter tidak wajib.
export const useCapilIkdData = (tanggal?: string) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const slug = {
    opd: "capil",
    application: "ikd",
  };
  const tgl = (() => {
    const raw = tanggal ? String(tanggal).trim() : "";
    const ok = /^\d{4}-\d{2}-\d{2}$/.test(raw);
    if (!ok) return "";
    const d = new Date(raw);
    if (Number.isNaN(d.valueOf())) return "";
    const iso = d.toISOString().slice(0, 10);
    return iso === raw ? raw : "";
  })();
  const CACHE_KEY = `capil-ikd:${slug.opd}:${slug.application}:tgl:${
    tgl ?? ""
  }`;
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        queryClient.setQueryData(
          [
            "data-capil-ikd",
            slug?.opd,
            slug?.application,
            tgl ?? "",
            session?.data?.token,
          ],
          data
        );
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, session?.data?.token]);
  return useQuery<any>({
    queryKey: [
      "data-capil-ikd",
      slug?.opd,
      slug?.application,
      tgl ?? "",
      session?.data?.token,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/json/${slug?.opd}/${slug?.application}`,
        {
          params: tgl ? { tanggal: tgl } : undefined,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.data?.token}`,
          },
        }
      );
      const data = response.data;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {}
      }
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!session?.data?.token,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
