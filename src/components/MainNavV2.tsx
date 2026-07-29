import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; title: string; children?: React.ReactNode }) {
  return (
    <li {...props}>
      <NavigationMenuLink render={
        <a href={href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            {children && (
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            )}
          </div>
        </a>
      } />
    </li>
  );
}

export function MainNavV2({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav className={cn("hidden lg:flex", className)} {...props}>
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {siteConfig.navItems.map((item) => {
            if (item.subItems && item.subItems.length > 0) {
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger className="text-[15px] font-medium h-10 px-3 bg-transparent hover:bg-muted/50">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-64 p-2">
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem.href}
                          title={subItem.label}
                          href={subItem.href}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  render={
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    />
                  }
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-muted/50 text-[15px] font-medium gap-1.5 h-10 px-3"
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default MainNavV2;