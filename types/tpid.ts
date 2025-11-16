export interface HargaPerPasar {
  [pasar: string]: number;
}

export interface HargaPerSatuanKomoditasItem {
  tgl: string;
  satuan: string;
  harga_rata_rata: number;
  harga_termurah: number;
  harga_termahal: number;
  pasar_termurah: string;
  pasar_termahal: string;
  harga_per_pasar: HargaPerPasar;
  selisih_harga_dari_yang_kemarin: string;
  persentase_selisih_harga_dari_yang_kemarin: string;
  status: string;
  [key: string]: any;
}

export interface HargaPerSatuanKomoditas {
  [satuan: string]: HargaPerSatuanKomoditasItem;
}

export interface HargaKomoditasItem {
  id: number;
  nama_komoditas: string;
  category: string | null;
  gambar: string;
  harga_per_satuan_komoditas: HargaPerSatuanKomoditas;
  last_update_komoditas: string;
  [key: string]: any;
}

export interface HargaKomoditasState {
  isLoaded: boolean;
  data: HargaKomoditasItem[];
}
