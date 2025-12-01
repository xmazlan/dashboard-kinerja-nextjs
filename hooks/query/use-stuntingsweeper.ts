import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useStuntingSweeperData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "stunting-sweeper",
    slug_url: "getDashboard",
  };
  return useQuery<any>({
    queryKey: [
      "data-stunting-sweeper",
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
export const useStuntingSweeperBulananData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "stunting-sweeper",
    slug_url: "getDashboardBulanan",
  };
  return useQuery<any>({
    queryKey: [
      "data-stunting-sweeper-bulanan",
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
export const useStuntingSweeperKecamatanData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "stunting-sweeper",
    slug_url: "getDashboardKec",
  };
  return useQuery<any>({
    queryKey: [
      "data-stunting-sweeper-kecamatan",
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
export const useStuntingSweeperKelurahanData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "stunting-sweeper",
    slug_url: "getDashboardKel",
  };
  return useQuery<any>({
    queryKey: [
      "data-stunting-sweeper-kelurahan",
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
export const useStuntingSweeperPuskesmasData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "stunting-sweeper",
    slug_url: "getDashboardPuskesmas",
  };
  return useQuery<any>({
    queryKey: [
      "data-stunting-sweeper-puskesmas",
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
export const useStuntingSweeperPosyanduData = () => {
  const { data: session } = useSession();
  const slug = {
    slug_aplikasi: "stunting-sweeper",
    slug_url: "getDashboardPosyandu",
  };
  return useQuery<any>({
    queryKey: [
      "data-stunting-sweeper-posyandu",
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
