import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function MainNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav className={cn("hidden lg:flex", className)} {...props}>
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {siteConfig.navItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-muted/50 text-[15px] font-medium gap-1.5 h-10 px-3"
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </a>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
