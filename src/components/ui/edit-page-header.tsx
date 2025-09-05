"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export interface EditPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbItems?: Array<{
    label: string;
    href: string;
    isCurrentPage?: boolean;
  }>;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  className?: string;
}

export function EditPageHeader({
  title,
  subtitle,
  breadcrumbItems,
  backHref,
  backLabel,
  actions,
  className,
}: EditPageHeaderProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Breadcrumb */}
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.isCurrentPage ? (
                    <BreadcrumbPage className="truncate max-w-[120px] sm:max-w-[150px]">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="truncate max-w-[120px] sm:max-w-[150px]"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header Content */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            {/* Back Button */}
            {backHref && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={backHref} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel || "Voltar"}
                  </Link>
                </Button>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
