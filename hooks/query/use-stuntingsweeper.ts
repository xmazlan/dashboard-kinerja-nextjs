import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Domain akan ditangkap otomatis oleh axios dari env/hostname,
// sehingga parameter tidak wajib.
export const useStuntingSweeperBulananData = () => {
    const { data: session } = useSession();
    const slug ={
        slug_aplikasi:'stunting-sweeper' ,
        slug_url: 'getdashboardbulanan',
    }
  return useQuery<any>({
    queryKey: ["data-stunting-sweeper", slug?.slug_aplikasi, slug?.slug_url, session?.data?.token],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/getResult/${slug?.slug_aplikasi}/${slug?.slug_url}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.data?.token}`,
        },
      });
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

