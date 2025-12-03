import * as React from "react";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useCapilIkdData = (tanggal?: string) => {
  const { data: session } = useSession();
  const slug = {
    opd: "capil",
    application: "ikd",
  };
  const tgl = (() => {
    const raw = tanggal ? String(tanggal).trim() : "";
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(raw);
    if (isValidFormat) {
      const d = new Date(raw);
      if (!Number.isNaN(d.valueOf())) {
        const iso = d.toISOString().slice(0, 10);
        if (iso === raw) return raw;
      }
    }
    // Default ke tanggal terbaru (hari ini, format YYYY-MM-DD)
    return new Date().toISOString().slice(0, 10);
  })();

  return useQuery<any>({
    queryKey: [
      "data-capil-ikd",
      slug?.opd,
      slug?.application,
      tgl ?? "",
      session?.data?.token,
    ],
    queryFn: async () => {
      const url = `${API_URL}/api/v1/json/${slug?.opd}/${slug?.application}`;
      const params = { tanggal: tgl };
      if (typeof window !== "undefined") {
        try {
          console.log("[CAPIL IKD] GET", url, params ? { params } : {});
        } catch {}
      }
      const response = await axios.get(url, {
        params,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.token}`,
        },
      });
      return response.data;
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
