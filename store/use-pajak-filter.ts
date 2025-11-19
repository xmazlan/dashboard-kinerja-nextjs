import { create } from "zustand";
import { persist } from "zustand/middleware";

type PajakFilterState = {
  bulan: string;
  tahun: string;
  dirty: boolean;
  setBulan: (bulan: string) => void;
  setTahun: (tahun: string) => void;
  clearFilter: () => void;
};

export const usePajakFilterStore = create<PajakFilterState>()(
  persist(
    (set) => ({
      bulan: String(new Date().getMonth() + 1),
      tahun: String(new Date().getFullYear()),
      dirty: false,
      setBulan: (bulan) => set({ bulan, dirty: true }),
      setTahun: (tahun) => set({ tahun, dirty: true }),
      clearFilter: () =>
        set({
          bulan: String(new Date().getMonth() + 1),
          tahun: String(new Date().getFullYear()),
          dirty: false,
        }),
    }),
    {
      name: "pajak-filter",
      partialize: (state) => ({ bulan: state.bulan, tahun: state.tahun }),
    }
  )
);