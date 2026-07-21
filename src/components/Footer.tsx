import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row md:py-0">
          <div className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Laboratorium Informatika Telkom University.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
            <a href="/tentang" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
              Tentang
            </a>
            <a href="/blog" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
              Pengumuman
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
