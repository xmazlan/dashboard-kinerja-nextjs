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
export const useDinkesHivData = () => {
  const { data: session, status } = useSession();
  const slug = {
    opd: "dinkes",
    application: "hiv-aids",
  };
  return useQuery<DisdikDoItmResponse>({
    queryKey: ["data-dinkes-hiv", session?.data?.token],
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
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: status === "authenticated" && !!session?.data?.token,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
