import * as React from "react";
import { X, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <>
      {/* Burger / Close Button */}
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted/50 transition-colors",
          className
        )}
        onClick={() => setOpen(prev => !prev)}
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
        <div className="fixed left-0 right-0 top-[97px] z-40 border-b border-border bg-background/95 backdrop-blur-md shadow-lg">
          <div className="flex flex-col">
            {/* Navigation Items */}
            <nav className="flex flex-col divide-y divide-border/50">

              {siteConfig.navItems.map((item) => {
                if (item.subItems && item.subItems.length > 0) {
                  const isExpanded = expandedMenus.includes(item.label);
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className="w-full flex items-center justify-between px-6 py-3 text-base font-medium text-foreground hover:bg-muted/40 transition-colors"
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
                              className="block pl-10 pr-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
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
                    className="px-6 py-3 text-base font-medium text-foreground hover:bg-muted/40 transition-colors"
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
