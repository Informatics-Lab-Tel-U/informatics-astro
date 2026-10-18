export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  subItems?: NavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    url: string;
  };
  links: {
    email: string;
  };
  navItems: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "Informatics Lab – Laboratorium Informatika Universitas Telkom",
  description:
    "Laboratorium Informatika Telkom University - Informasi jadwal praktikum, modul, tugas pendahuluan, pengumuman, dan kegiatan praktikum bagi mahasiswa.",
  url: "https://iflab.web.id",
  author: {
    name: "Laboratorium Informatika Telkom University",
    url: "https://iflab.web.id",
  },
  links: {
    email: "informaticslab@telkomuniversity.ac.id",
  },
  navItems: [
    { href: "/", label: "Home" },
    {
      href: "/tentang",
      label: "Tentang Kami",
      subItems: [
        { href: "/tentang/sejarah", label: "Sejarah & Visi Misi" },
        { href: "/tentang/struktur", label: "Struktur Organisasi" },
        { href: "/tentang/fasilitas", label: "Fasilitas & Sumber Daya" },
      ],
    },
    {
      href: "/praktikum",
      label: "Praktikum",
      subItems: [
        { href: "/praktikum/jadwal", label: "Jadwal Praktikum" },
        { href: "/category/tugas-pendahuluan", label: "Tugas Pendahuluan" },
        { href: "/praktikum/feedback", label: "Feedback Praktikum" },
      ],
    },
    { href: "/informasi", label: "Informasi & Kegiatan" },
    {
      href: "/tim",
      label: "Tim Lab",
      subItems: [
        { href: "/tim/kaur-laboran", label: "Kaur & Laboran" },
        { href: "/tim/asisten-lab", label: "Asisten Laboratorium" },
        { href: "/tim/asisten-praktikum", label: "Asisten Praktikum" },
      ],
    },
    { href: "/galeri", label: "Galeri" },
  ],
};
