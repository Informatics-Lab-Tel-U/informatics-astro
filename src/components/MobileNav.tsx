import { X, ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState<Set<string>>(new Set());

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <>
      {/* Burger / Close Button */}
      <button
        type="button"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-muted/50",
          className,
        )}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle Menu"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </div>
        )}
      </button>

      {/* Dropdown Panel — fixed, full width, anchored below header */}
      {open && (
        <div className="fixed top-[65px] right-0 left-0 z-40 border-b border-border bg-background/95 shadow-lg backdrop-blur-md">
          <div className="flex flex-col">
            {/* Navigation Items */}
            <nav className="flex flex-col divide-y divide-border/50">
              {siteConfig.navItems.map((item) => {
                if (item.subItems && item.subItems.length > 0) {
                  const isExpanded = expandedMenus.has(item.label);
                  return (
                    <div key={item.href}>
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.label)}
                        className="flex w-full items-center justify-between px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/40"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                      {isExpanded && (
                        <div className="divide-y divide-border/30 bg-muted/20">
                          {item.subItems.map((subItem) => (
                            <a
                              key={subItem.href}
                              href={subItem.href}
                              target={subItem.external ? "_blank" : undefined}
                              rel={subItem.external ? "noopener noreferrer" : undefined}
                              className="flex items-center justify-between py-2.5 pr-6 pl-10 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                              onClick={() => setOpen(false)}
                            >
                              <span>{subItem.label}</span>
                              {subItem.external && <span className="text-xs">↗</span>}
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
                    className="px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/40"
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Footer Action Button */}
            <div className="border-t border-border/50 px-6 py-4">
              <a href="/category/tugas-pendahuluan" onClick={() => setOpen(false)}>
                <Button className="w-full font-semibold" size="lg">
                  Tugas Pendahuluan
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
