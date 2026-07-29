import * as React from "react";
import { Search } from "lucide-react";

import { MainNavV2 } from "@/components/MainNavV2";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-primary bg-background/95 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-24 items-center justify-between">
          {/* Kiri: Mobile Nav (Mobile) & Logo (Desktop) */}
          <div className="flex flex-1 items-center justify-start lg:flex-none">
            <MobileNav className="flex lg:hidden" />
            <a href="/" className="hidden lg:flex items-center transition-opacity hover:opacity-80">
              <img src="/logo-iflab-svg.svg" alt="Lab Informatika Logo" className="h-14 w-auto dark:hidden" />
              <img src="/logo-iflab-svg-dark.svg" alt="Lab Informatika Logo" className="h-14 w-auto hidden dark:block" />
            </a>
          </div>

          {/* Tengah: Logo (Mobile) */}
          <div className="flex lg:hidden flex-1 items-center justify-center">
            <a href="/" className="flex items-center transition-opacity hover:opacity-80">
              <img src="/logo-iflab-svg.svg" alt="Lab Informatika Logo" className="h-12 w-auto dark:hidden" />
              <img src="/logo-iflab-svg-dark.svg" alt="Lab Informatika Logo" className="h-12 w-auto hidden dark:block" />
            </a>
          </div>

          <div className="flex flex-1 items-center justify-end gap-6">
            <MainNavV2 />

            <div className="flex items-center gap-2 md:gap-4">
              <a href="/category/tugas-pendahuluan" className="hidden md:inline-flex">
                <Button className="px-6 font-semibold">
                  Tugas Pendahuluan
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="text-muted-foreground hidden md:inline-flex">
                <Search className="size-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
