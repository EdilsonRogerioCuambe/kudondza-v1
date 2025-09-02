"use client";

import { cn } from "@/lib/utils";
import { type Icon } from "@tabler/icons-react";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useActiveRoute } from "@/hooks/use-active-route";
import Link from "next/link";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isActiveRoute, isExactMatch } = useActiveRoute();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActiveRoute(item.url);
            const isExact = isExactMatch(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "transition-all duration-200 ease-linear",
                    isActive && "bg-accent text-accent-foreground",
                    isExact &&
                      "bg-primary/10 text-primary border-r-2 border-primary"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon
                      className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-primary" : "text-muted-foreground",
                        isExact && "text-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "transition-colors duration-200",
                        isActive
                          ? "text-primary font-medium"
                          : "text-foreground",
                        isExact && "text-primary font-semibold"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
