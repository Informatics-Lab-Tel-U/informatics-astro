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
    github: string;
  };
  navItems: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "Laboratorium Informatika",
  description:
    "Portal resmi Laboratorium Informatika untuk informasi, pengumuman, dan tugas pendahuluan.",
  url: "https://lab.informatics.edu",
  author: {
    name: "Laboratorium",
    url: "https://lab.informatics.edu",
  },
  links: {
    github: "https://github.com",
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
      label: "Informasi & Berita",
      subItems: [
        { href: "/informasi/pengumuman", label: "Pengumuman Resmi" },
        { href: "/informasi/berita", label: "Berita & Kegiatan Lab" },
      ],
    },
    {
      href: "/tim",
      label: "Tim Lab",
      subItems: [
        { href: "/tim/kaur", label: "Kaur & Laboran" },
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
