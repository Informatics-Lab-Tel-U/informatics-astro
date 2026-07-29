import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import type { BlogPost } from "@/lib/api";

interface LandingPageProps {
  recentPosts?: BlogPost[];
}

export function LandingPage({ recentPosts = [] }: LandingPageProps) {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section (Text) - Wide container for impact */}
      <section className="container-wide pt-20 pb-12 md:pt-32 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-[5rem] leading-[1.1] text-foreground">
              Laboratorium Informatika
            </h1>
          </div>
          <div className="flex flex-col items-start text-left">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Website ini akan digunakan untuk mengumumkan semua informasi resmi dari IFLab mulai dari pengumuman jadwal pengganti, peraturan praktikum hingga pengumuman terkait tugas pendahuluan.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/tentang">
                <Button className="px-6 font-semibold">Tentang Kami</Button>
              </a>
              <a href="/post">
                <Button variant="outline" className="px-6 font-semibold">Feedback Praktikum</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section (Image Container) - Full-bleed with max-width constraint and wider aspect ratio */}
      <section className="w-full px-4 sm:px-6 pb-20 md:pb-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-muted/30 border border-border">
            <img
              src="/default-image.svg"
              alt="Hero Showcase"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Layanan dan Feedback Section - Content container for balanced text readability */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-content">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl mb-4">Layanan & Feedback</h2>
            <p className="text-lg text-muted-foreground">
              Platform lengkap untuk informasi praktikum dan sarana komunikasi dengan laboratorium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border border-border rounded-3xl overflow-hidden bg-background">
            {/* Layanan Card */}
            <div className="p-10 md:p-14 flex flex-col hover:bg-muted/30 transition-colors duration-500">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-semibold">
                01
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-4 text-foreground">Layanan Informasi</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px] sm:text-base">
                Website Laboratorium Praktikum Informatika Telkom University memiliki fungsionalitas untuk memberikan informasi seputar nilai praktikum dan jadwal praktikum yang akan berlangsung kepada semua warga Laboratorium Informatika.
              </p>
            </div>

            {/* Feedback Card */}
            <div className="p-10 md:p-14 flex flex-col hover:bg-muted/30 transition-colors duration-500">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-semibold">
                02
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-4 text-foreground">Layanan Feedback</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px] sm:text-base">
                Layanan feedback ini dibuat sebagai sarana untuk menyampaikan keluhan atau berdiskusi untuk memajukan Laboratorium Informatika. Untuk melakukan pengisian feedback wajib menggunakan akun SSO Telkom University terlebih dahulu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements & Tasks Section - Wide container to match hero, optimal for 3-col grid */}
      <section className="container-wide py-24 md:py-32">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl mb-4">Pengumuman & Tugas</h2>
            <p className="text-lg text-muted-foreground">Informasi terbaru terkait kegiatan praktikum dan akademik.</p>
          </div>
          <a href="/post" className="shrink-0">
            <Button variant="outline" className="px-6 font-semibold">Lihat Semua</Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
