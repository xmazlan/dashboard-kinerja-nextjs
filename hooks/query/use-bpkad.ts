import * as React from "react";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Domain akan ditangkap otomatis oleh axios dari env/hostname,
// sehingga parameter tidak wajib.
interface BpkadSp2dRow {
  Persentase?: number | string;
  Realisasi_OPD?: number | string;
  PaguAnggaran?: number | string;
  OPD?: unknown;
}
interface BpkadSp2dResponse {
  data?: {
    Rekap_Kota?: {
      Periode?: string;
      Jumlah_Realisasi?: number | string;
      Jumlah_Pagu?: number | string;
      Persentase?: number | string;
    };
    data?: BpkadSp2dRow[];
  };
  last_get?: string;
}

interface BpkadRfkRow {
  PER_UANG?: number | string;
  PER_FISIK?: number | string;
  OPD?: unknown;
}
interface BpkadRfkResponse {
  data?: {
    Rekap_Kota?: {
      Tanggal?: string;
      persen_keu?: number | string;
      persen_fisik?: number | string;
    };
    data?: BpkadRfkRow[];
  };
  last_get?: string;
}

export const useBpkadSp2dData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "realisasi",
    slug_url: "realisasi",
  };
  return useQuery<BpkadSp2dResponse>({
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
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled: !!session?.data?.token,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
export const useBpkadRfkData = (opts?: { tanggal?: string }) => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "rfk",
    slug_url: "rfk",
  };
  const tanggal = opts?.tanggal?.trim();
  const qs = tanggal ? `?${new URLSearchParams({ Tanggal: tanggal }).toString()}` : "";
  return useQuery<BpkadRfkResponse>({
    queryKey: [
      "data-bpkad-rfk",
      slug?.slug_aplikasi,
      slug?.slug_url,
      tanggal ?? "",
      session?.data?.token,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/getResult/${slug?.slug_aplikasi}/${slug?.slug_url}${qs}`,
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
