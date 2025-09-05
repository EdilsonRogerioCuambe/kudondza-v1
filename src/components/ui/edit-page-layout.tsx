"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface EditPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function EditPageLayout({ children, className }: EditPageLayoutProps) {
  return (
    <main className={cn("flex-1 space-y-4 p-4 md:p-8 pt-6", className)}>
      {children}
    </main>
  );
}
