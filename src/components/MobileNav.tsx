import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
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
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent",
          className,
        )}
      >
        <div className="relative flex h-8 w-4 items-center justify-center">
          <div className="relative size-4">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open ? "top-[0.4rem] -rotate-45" : "top-1",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open ? "top-[0.4rem] rotate-45" : "top-2.5",
              )}
            />
          </div>
          <span className="sr-only">Toggle Menu</span>
        </div>
        <span className="flex h-8 items-center text-lg leading-none font-medium text-foreground sr-only sm:not-sr-only">
          Menu
        </span>
      </PopoverTrigger>

      <PopoverContent
        className="no-scrollbar h-(--available-height) w-(--available-width) overflow-y-auto rounded-none border-none bg-background/95 p-0 shadow-none backdrop-blur-md duration-200"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={12}
      >
        <div className="flex flex-col gap-8 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              Navigasi
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href="/"
                className="text-base font-medium text-foreground transition-colors hover:text-primary py-2"
                onClick={() => setOpen(false)}
              >
                Home
              </a>

              {siteConfig.navItems.map((item) => {
                if (item.subItems && item.subItems.length > 0) {
                  const isExpanded = expandedMenus.includes(item.label);
                  return (
                    <div key={item.href} className="flex flex-col">
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className="flex items-center justify-between text-base font-medium text-muted-foreground transition-colors hover:text-foreground py-2 text-left"
                      >
                        {item.label}
                        <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="ml-4 flex flex-col gap-1 border-l border-border pl-3 py-1">
                          {item.subItems.map((subItem) => (
                            <a
                              key={subItem.href}
                              href={subItem.href}
                              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-1.5"
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
                    className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            
            <div className="mt-8 border-t border-border pt-6">
              <a 
                href="/tugas-pendahuluan" 
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full font-semibold"
                )}
                onClick={() => setOpen(false)}
              >
                Tugas Pendahuluan
              </a>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
