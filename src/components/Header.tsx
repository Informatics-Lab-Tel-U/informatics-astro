import { Search } from "lucide-react";
import * as React from "react";

import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CommandMenu } from "./CommandMenu";

export function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-primary bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between lg:h-24">
          {/* Kiri: Mobile Nav (Mobile) & Logo (Desktop) */}
          <div className="flex flex-1 items-center justify-start lg:flex-none">
            <MobileNav className="flex lg:hidden" />
            <a href="/" className="hidden items-center transition-opacity hover:opacity-80 lg:flex">
              <img
                src="/logo-iflab-svg.svg"
                alt="Lab Informatika Logo"
                width="200"
                height="56"
                className="h-14 w-auto dark:hidden"
              />
              <img
                src="/logo-iflab-svg-dark.svg"
                alt="Lab Informatika Logo"
                width="200"
                height="56"
                className="hidden h-14 w-auto dark:block"
              />
            </a>
          </div>

          {/* Tengah: Logo (Mobile) */}
          <div className="flex flex-1 items-center justify-center lg:hidden">
            <a href="/" className="flex items-center transition-opacity hover:opacity-80">
              <img
                src="/logo-iflab-svg.svg"
                alt="Lab Informatika Logo"
                width="171"
                height="48"
                className="h-10 w-auto dark:hidden"
              />
              <img
                src="/logo-iflab-svg-dark.svg"
                alt="Lab Informatika Logo"
                width="171"
                height="48"
                className="hidden h-10 w-auto dark:block"
              />
            </a>
          </div>

          <div className="flex flex-1 items-center justify-end gap-6">
            <MainNav />

            <div className="flex items-center gap-2 md:gap-4">
              <a href="/category/tugas-pendahuluan" className="hidden md:inline-flex">
                <Button className="px-6 font-semibold">Tugas Pendahuluan</Button>
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                aria-label="Buka menu pencarian"
                onClick={() => setOpen(true)}
              >
                <Search className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CommandMenu open={open} setOpen={setOpen} />
    </header>
  );
}
