import * as React from "react";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useOpdKinerjaData = ({
  opdName,
  opdAplication,
}: {
  opdName: string;
  opdAplication: string;
}) => {
  const { data: session } = useSession();

  return useQuery<any>({
    queryKey: [
      "data-opd-kinerja",
      opdName,
      opdAplication,
      session?.data?.token,
    ],
    queryFn: async () => {
      const url = `${API_URL}/api/v1/json/${opdName}/${opdAplication}`;
      const response = await axios.get(url, {
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
    enabled: !!session?.data?.token && !!opdName && !!opdAplication,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
