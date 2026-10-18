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
  external,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  title: string;
  children?: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center justify-between leading-none font-medium">
                <span>{title}</span>
                {external && <span className="text-xs text-muted-foreground">↗</span>}
              </div>
              {children && <div className="line-clamp-2 text-muted-foreground">{children}</div>}
            </div>
          </a>
        }
      />
    </li>
  );
}

export function MainNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav className={cn("hidden lg:flex", className)} {...props}>
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {siteConfig.navItems.map((item) => {
            if (item.subItems && item.subItems.length > 0) {
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger className="h-10 bg-transparent px-3 text-[15px] font-medium hover:bg-muted/50">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-64 p-2">
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem.href}
                          title={subItem.label}
                          href={subItem.href}
                          external={subItem.external}
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
                    "h-10 gap-1.5 bg-transparent px-3 text-[15px] font-medium hover:bg-muted/50",
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

export default MainNav;
