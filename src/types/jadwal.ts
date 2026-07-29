export type JadwalPublic = {
  id: string;
  hari: string;
  jam: string;
  sesi: number | null;
  ruangan: string | null;
  kelas: string;
  mata_kuliah: string;
  program_studi: string;
  praktikum: string;
  warna: string | null;
  dosen: string | null;
  total_asprak: number;
  is_pengganti?: boolean;
};
