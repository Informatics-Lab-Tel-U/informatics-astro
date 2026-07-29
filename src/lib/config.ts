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
    "Website Laboratorium Praktikum Informatika Telkom University memiliki fungsionalitas untuk memberikan informasi seputar nilai praktikum dan jadwal praktikum yang akan berlangsung.",
  url: "https://informatics.labs.telkomuniversity.ac.id",
  author: {
    name: "Laboratorium",
    url: "https://informatics.labs.telkomuniversity.ac.id",
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
        { href: "/praktikum/nilai", label: "Nilai & Hasil" },
        { href: "/category/tugas-pendahuluan", label: "Tugas Pendahuluan & Modul" },
        { href: "/praktikum/feedback", label: "Feedback Praktikum" },
      ],
    },
    {
      href: "/informasi",
      label: "Informasi & Kegiatan",
      subItems: [
        { href: "/category/informasi", label: "Pengumuman & Informasi" },
        { href: "/category/kegiatan", label: "Kegiatan Lab" },
      ],
    },
    {
      href: "/tim",
      label: "Tim Lab",
      subItems: [
        { href: "/tim/kaur-laboran", label: "Kaur & Laboran" },
        { href: "/tim/asisten-lab", label: "Asisten Laboratorium" },
        { href: "/tim/asisten-praktikum", label: "Asisten Praktikum" },
      ],
    },
    {
      href: "/galeri",
      label: "Galeri",
      subItems: [
        { href: "/galeri/dokumentasi", label: "Dokumentasi Kegiatan" },
      ],
    },
  ],
};
