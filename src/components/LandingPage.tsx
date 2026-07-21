import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section (Text) */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-12 md:pt-32 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-[5rem] leading-[1.1] text-foreground">
              Laboratorium Informatika
            </h1>
          </div>
          <div className="flex flex-col items-start text-left">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Fasilitas terpadu Fakultas Informatika (School of Computing) Telkom University yang mendukung pendidikan, penelitian, dan pengabdian masyarakat dengan lebih dari 17 laboratorium khusus.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/tentang">
                <Button className="px-6 font-semibold">Tentang Kami</Button>
              </a>
              <a href="/blog">
                <Button variant="outline" className="px-6 font-semibold">Lihat Pengumuman</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section (Image Container) */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-20 md:pb-32">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-muted/30 border border-border">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl mb-4">Visi & Misi</h2>
            <p className="text-lg text-muted-foreground">
              Landasan utama yang memandu Laboratorium Informatika dalam mendukung kegiatan akademik dan riset di tingkat global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border border-border rounded-3xl overflow-hidden bg-background">
            {/* Visi */}
            <div className="p-10 md:p-14 flex flex-col hover:bg-muted/30 transition-colors duration-500">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-semibold">
                01
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-4 text-foreground">Visi Utama</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px] sm:text-base">
                Menjadi laboratorium unggulan bertaraf internasional di bidang informatika yang berperan aktif dalam pengembangan ilmu pengetahuan dan teknologi informasi, serta menghasilkan talenta digital yang kompeten dan berdaya saing global.
              </p>
            </div>

            {/* Misi */}
            <div className="p-10 md:p-14 flex flex-col hover:bg-muted/30 transition-colors duration-500">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-semibold">
                02
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-4 text-foreground">Misi Kami</h3>
              <ul className="text-muted-foreground leading-relaxed text-[15px] sm:text-base space-y-4 list-none p-0 m-0">
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </span>
                  <span>Menyelenggarakan kegiatan praktikum yang berkualitas dan selaras dengan kebutuhan industri.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </span>
                  <span>Mendukung riset dan inovasi di bidang rekayasa perangkat lunak, kecerdasan buatan, dan komputasi modern.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </span>
                  <span>Menyediakan lingkungan fasilitas yang kondusif bagi eksplorasi teknologi civitas akademika.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements & Tasks Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl mb-4">Pengumuman & Tugas</h2>
            <p className="text-lg text-muted-foreground">Informasi terbaru terkait kegiatan praktikum dan akademik.</p>
          </div>
          <a href="/blog" className="shrink-0">
            <Button variant="outline" className="px-6 font-semibold">Lihat Semua</Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="flex flex-col overflow-hidden rounded-3xl border border-border shadow-none hover:border-primary/20 transition-colors duration-300 bg-background p-0 gap-0">
            <div className="aspect-video w-full bg-muted rounded-t-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
                alt="Klinik Akademik"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="flex-1 px-6 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="rounded-md px-2.5 py-0.5 text-xs font-medium">Pengumuman</Badge>
              </div>
              <CardTitle className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground">
                Pendaftaran Klinik Akademik Telah Dibuka
              </CardTitle>
              <CardDescription className="line-clamp-3 mt-2 text-muted-foreground text-[15px] leading-relaxed">
                Klinik Akademik untuk mata kuliah Algoritma Pemrograman, Struktur Data, dan Jaringan Komputer telah dibuka. Segera daftarkan diri Anda untuk sesi bimbingan bersama asisten terpilih!
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-6 pb-6 pt-0 mt-auto flex flex-wrap gap-2">
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">Klinik Akademik</span>
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">Tutorial</span>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card className="flex flex-col overflow-hidden rounded-3xl border border-border shadow-none hover:border-primary/20 transition-colors duration-300 bg-background p-0 gap-0">
            <div className="aspect-video w-full bg-muted rounded-t-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
                alt="Tugas Pendahuluan"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="flex-1 px-6 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="rounded-md px-2.5 py-0.5 text-xs font-medium">Tugas</Badge>
              </div>
              <CardTitle className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground">
                Tugas Pendahuluan Praktikum Pemrograman Berorientasi Objek
              </CardTitle>
              <CardDescription className="line-clamp-3 mt-2 text-muted-foreground text-[15px] leading-relaxed">
                Modul 1 PBO telah dirilis. Silakan kerjakan tugas pendahuluan dan kumpulkan sesuai tenggat waktu yang tertera melalui portal asisten masing-masing sebelum jadwal praktikum.
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-6 pb-6 pt-0 mt-auto flex flex-wrap gap-2">
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">Praktikum PBO</span>
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">Modul 1</span>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card className="flex flex-col overflow-hidden rounded-3xl border border-border shadow-none hover:border-primary/20 transition-colors duration-300 bg-background p-0 gap-0">
            <div className="aspect-video w-full bg-muted rounded-t-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
                alt="Info Rekrutmen"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="flex-1 px-6 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="rounded-md px-2.5 py-0.5 text-xs font-medium">Info</Badge>
              </div>
              <CardTitle className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground">
                Open Recruitment Asisten Laboratorium Fakultas Informatika
              </CardTitle>
              <CardDescription className="line-clamp-3 mt-2 text-muted-foreground text-[15px] leading-relaxed">
                Ingin berkontribusi sebagai asisten praktikum? Fakultas Informatika (School of Computing) resmi membuka rekrutmen asisten untuk periode akademik mendatang. Persiapkan diri Anda!
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-6 pb-6 pt-0 mt-auto flex flex-wrap gap-2">
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">Oprec Asisten</span>
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">Penting</span>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
