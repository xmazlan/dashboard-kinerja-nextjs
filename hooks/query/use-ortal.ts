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
export const useOrtalIkmData = () => {
  const { data: session } = useSession();
  const slug = {
    opd: "ortal",
    application: "ikm",
  };
  return useQuery<DisdikDoItmResponse>({
    queryKey: ["data-ortal-ikm", session?.data?.token],
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
export const useOrtalRbData = () => {
  const { data: session } = useSession();
  const slug = {
    opd: "ortal",
    application: "rb",
  };
  return useQuery<DisdikDoItmResponse>({
    queryKey: ["data-ortal-rb", session?.data?.token],
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
export const useOrtalSakipData = () => {
  const { data: session } = useSession();
  const slug = {
    opd: "ortal",
    application: "sakip",
  };
  return useQuery<DisdikDoItmResponse>({
    queryKey: ["data-ortal-sakip", session?.data?.token],
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
