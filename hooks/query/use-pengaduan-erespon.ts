import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Domain akan ditangkap otomatis oleh axios dari env/hostname,
// sehingga parameter tidak wajib.
export const usePengaduanEresponMasterData = () => {
    const { data: session } = useSession();
    const slug ={
        slug_aplikasi:'e-respone' ,
        slug_url: 'master-data',
    }
  return useQuery<any>({
    queryKey: ["data-pengaduan-erespon", slug?.slug_aplikasi, slug?.slug_url, session?.data?.token],
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

export const usePengaduanEresponSemuaData = () => {
    const { data: session } = useSession();
    const slug ={
        slug_aplikasi:'e-respone' ,
        slug_url: 'jenis-aduan-all',
    }
  return useQuery<any>({
    queryKey: ["data-pengaduan-erespon", slug?.slug_aplikasi, slug?.slug_url, session?.data?.token],
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
export const usePengaduanEresponOpdData = () => {
    const { data: session } = useSession();
    const slug ={
        slug_aplikasi:'e-respone' ,
        slug_url: 'jenis-aduan-peropd',
    }
  return useQuery<any>({
    queryKey: ["data-pengaduan-erespon", slug?.slug_aplikasi, slug?.slug_url, session?.data?.token],
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
export const usePengaduanEresponKecamtanData = () => {
    const { data: session } = useSession();
    const slug ={
        slug_aplikasi:'e-respone' ,
        slug_url: 'per-kecamatan',
    }
  return useQuery<any>({
    queryKey: ["data-pengaduan-erespon", slug?.slug_aplikasi, slug?.slug_url, session?.data?.token],
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
export const usePengaduanEresponKelurahanData = () => {
    const { data: session } = useSession();
    const slug ={
        slug_aplikasi:'e-respone' ,
        slug_url: 'per-kelurahan',
    }
  return useQuery<any>({
    queryKey: ["data-pengaduan-erespon", slug?.slug_aplikasi, slug?.slug_url, session?.data?.token],
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