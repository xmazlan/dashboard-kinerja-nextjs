import * as React from "react";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const usePuprData = () => {
  const { data: session, status } = useSession();
 const slug = {
    opd: "pupr",
    application: "l2t2",
  };
  return useQuery<any>({
    queryKey: ["data-pupr-l2t2", session?.data?.token],
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
