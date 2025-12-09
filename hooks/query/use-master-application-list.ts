import * as React from "react";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useMasterApplicationList = () => {
  const { data: session } = useSession();

  return useQuery<any>({
    queryKey: ["master-application-list", session?.data?.token],
    queryFn: async () => {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (session?.data?.token)
        headers.Authorization = `Bearer ${session.data.token}`;
      const url = `${API_URL}/api/v1/master/aplikasi`;
      const response = await axios.get(url, { headers });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled:
      Boolean(session?.data?.token) &&
      String(session?.data?.user?.role || "").toLowerCase() === "superadmin",
    staleTime: Infinity,
    retry: false,
    retryDelay: 1000,
  });
};
