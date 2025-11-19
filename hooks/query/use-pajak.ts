import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
// const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL_PAJAK;

const tokenStatic = "MI3dEnOEvx0vj6vmjpJTVoJNxQH7ACRV";
export const useTahunPajakData = () => {
  return useQuery<any>({
    queryKey: ["data-tahun-pajak", tokenStatic],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/dasbor/tahun`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenStatic}`,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!tokenStatic,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
export const useJenisPajakData = () => {
  return useQuery<any>({
    queryKey: ["data-jenis-pajak", tokenStatic],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/dasbor/jenispajak`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenStatic}`,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!tokenStatic,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
export const usePajakStatistikData = ({
  jenispajak,
  bulan,
  tahun,
}: {
  jenispajak?: string | number;
  bulan?: string | number;
  tahun?: string | number;
}) => {
  const { data: session } = useSession();
  return useQuery<any>({
    queryKey: [
      "data-pajak-statistik-pbjt",
      session?.data?.token,
      String(jenispajak ?? ""),
      String(bulan ?? ""),
      String(tahun ?? ""),
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (jenispajak != null && jenispajak !== "")
        params.set("jenispajak", String(jenispajak));
      if (bulan != null && bulan !== "") params.set("bulan", String(bulan));
      if (tahun != null && tahun !== "") params.set("tahun", String(tahun));

      const qs = params.toString();
      const url = `${API_URL}/api/dasbor/statistik${qs ? `?${qs}` : ""}`;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenStatic}`,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled:
      !!tokenStatic && !!jenispajak && jenispajak !== "" && !!bulan && !!tahun,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
  });
};
