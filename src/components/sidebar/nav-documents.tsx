"use client";

import { cn } from "@/lib/utils";
import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useActiveRoute } from "@/hooks/use-active-route";
import Link from "next/link";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const { isActiveRoute, isExactMatch } = useActiveRoute();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isActiveRoute(item.url);
          const isExact = isExactMatch(item.url);

          return (
            <SidebarMenuItem key={item.name}>
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
                      isActive ? "text-primary font-medium" : "text-foreground",
                      isExact && "text-primary font-semibold"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-sm"
                  >
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <IconFolder />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconShare3 />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <IconTrash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <IconDots className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
