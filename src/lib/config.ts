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
  navItems: {
    href: string;
    label: string;
    external?: boolean;
  }[];
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
    { href: "/tentang", label: "Tentang" },
    { href: "/blog", label: "Pengumuman" },
  ],
};
