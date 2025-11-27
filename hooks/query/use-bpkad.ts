import * as React from "react";
import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Domain akan ditangkap otomatis oleh axios dari env/hostname,
// sehingga parameter tidak wajib.
export const useBpkadSp2dData = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const slug = {
    slug_aplikasi: "sp2d",
    slug_url: "ver2",
  };
  const CACHE_KEY = `bpkad-sp2d:${slug.slug_aplikasi}:${slug.slug_url}`;
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        queryClient.setQueryData(
          [
            "data-bpkad-sp2d",
            slug?.slug_aplikasi,
            slug?.slug_url,
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
      "data-bpkad-sp2d",
      slug?.slug_aplikasi,
      slug?.slug_url,
      session?.data?.token,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/getResult/${slug?.slug_aplikasi}/${slug?.slug_url}`,
        {
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
export const useBpkadRfkData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "api-rfk",
    slug_url: "ver2",
  };
  return useQuery<any>({
    queryKey: [
      "data-bpkad-rfk",
      slug?.slug_aplikasi,
      slug?.slug_url,
      session?.data?.token,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/getResult/${slug?.slug_aplikasi}/${slug?.slug_url}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.data?.token}`,
          },
        }
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!session?.data?.token,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
