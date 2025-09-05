"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface ViewPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ViewPageLayout({ children, className }: ViewPageLayoutProps) {
  return <div className={cn("py-8 space-y-10", className)}>{children}</div>;
}
