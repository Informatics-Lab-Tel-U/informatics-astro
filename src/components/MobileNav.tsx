import * as React from "react";
import { X, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted/50 transition-colors">
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-foreground transition-all duration-300"></span>
              <span className="block h-0.5 w-5 bg-foreground transition-all duration-300"></span>
            </div>
          )}
          <span className="sr-only">Toggle Menu</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[calc(100vw-32px)] sm:max-w-md rounded-lg border border-border bg-background/95 backdrop-blur-md p-0 shadow-lg mx-4"
        align="start"
        side="bottom"
        alignOffset={-24}
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Navigasi</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="overflow-y-auto max-h-[calc(100vh-140px)]">
            <nav className="flex flex-col divide-y divide-border/50">
              {/* Home */}
              <a
                href="/"
                className="px-5 py-3 text-base font-medium text-foreground hover:bg-muted/40 transition-colors"
                onClick={() => setOpen(false)}
              >
                Home
              </a>

              {/* Menu Items */}
              {siteConfig.navItems.map((item) => {
                if (item.subItems && item.subItems.length > 0) {
                  const isExpanded = expandedMenus.includes(item.label);
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className="w-full flex items-center justify-between px-5 py-3 text-base font-medium text-foreground hover:bg-muted/40 transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200 flex-shrink-0",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      {isExpanded && (
                        <div className="bg-muted/20 divide-y divide-border/30">
                          {item.subItems.map((subItem) => (
                            <a
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-5 py-2.5 pl-10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                              onClick={() => setOpen(false)}
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                    className="px-5 py-3 text-base font-medium text-foreground hover:bg-muted/40 transition-colors"
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Footer Action Button */}
          <div className="border-t border-border/50 px-5 py-4">
            <a 
              href="/tugas-pendahuluan"
              onClick={() => setOpen(false)}
            >
              <Button className="w-full font-semibold" size="lg">
                Tugas Pendahuluan
              </Button>
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
