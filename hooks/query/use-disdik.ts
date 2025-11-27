import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DisdikItem {
  keterangan?: string;
  nama?: string;
  nilai?: number | string;
  tahun?: number | string;
}
interface DisdikDoItmResponse {
  success: boolean;
  message?: string;
  data?: {
    do?: DisdikItem[];
    ltm?: DisdikItem[];
  };
  last_get?: string;
}
export const useDisdikDoItmData = () => {
  const { data: session } = useSession();
  const slug = {
    opd: "disdik",
    application: "do_ltm",
  };
  return useQuery<DisdikDoItmResponse>({
    queryKey: ["data-disdik-do_ltm", session?.data?.token],
    queryFn: async () => {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (session?.data?.token)
        headers.Authorization = `Bearer ${session.data.token}`;
      const url = `${API_URL}/api/v1/json/${slug.opd}/${slug.application}`;
      const response = await axios.get(url, { headers });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled: true,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
export const useDisdikKebutuhanGuruData = () => {
  const { data: session } = useSession();
  const slug = {
    opd: "disdik",
    application: "kebutuhan_guru",
  };
  return useQuery<any>({
    queryKey: ["data-disdik-kebutuhan_guru", session?.data?.token],
    queryFn: async () => {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (session?.data?.token)
        headers.Authorization = `Bearer ${session.data.token}`;
      const url = `${API_URL}/api/v1/json/${slug.opd}/${slug.application}`;
      const response = await axios.get(url, { headers });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled: true,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
