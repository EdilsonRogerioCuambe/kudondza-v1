"use client";

import { cn } from "@/lib/utils";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useActiveRoute } from "@/hooks/use-active-route";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const { isActiveRoute, isExactMatch } = useActiveRoute();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Criação Rapida"
              className={cn(
                "min-w-8 duration-200 ease-linear",
                isActiveRoute("/admin/dashboard/courses/create")
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              )}
            >
              <Link href="/admin/dashboard/courses/create">
                <IconCirclePlusFilled />
                <span>Criação Rapida</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActiveRoute(item.url);
            const isExact = isExactMatch(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn(
                    "transition-all duration-200 ease-linear",
                    isActive && "bg-accent text-accent-foreground",
                    isExact &&
                      "bg-primary/10 text-primary border-r-2 border-primary"
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "transition-colors duration-200",
                          isActive ? "text-primary" : "text-muted-foreground",
                          isExact && "text-primary"
                        )}
                      />
                    )}
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
