import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:items-start">
            <p>&copy; {new Date().getFullYear()} Laboratorium Informatika Telkom University.</p>
            <p>
              Hubungi kami:{" "}
              <a 
                href={`mailto:${siteConfig.links.email}`} 
                className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
              >
                {siteConfig.links.email}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
            <a href="/tentang" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
              Tentang
            </a>
            <a href="/post" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
              Pengumuman
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
