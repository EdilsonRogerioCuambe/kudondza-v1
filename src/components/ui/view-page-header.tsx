"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Layers, Users } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export interface ViewPageHeaderProps {
  title: string;
  subtitle?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  enrollmentsCount?: number;
  modulesCount?: number;
  tags?: string[];
  breadcrumbItems?: Array<{
    label: string;
    href: string;
    isCurrentPage?: boolean;
  }>;
  actions?: ReactNode;
  className?: string;
}

export function ViewPageHeader({
  title,
  subtitle,
  level,
  enrollmentsCount,
  modulesCount,
  tags,
  breadcrumbItems,
  actions,
  className,
}: ViewPageHeaderProps) {
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl">
                {subtitle}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {level && (
                <span className="inline-flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  {level}
                </span>
              )}
              {enrollmentsCount !== undefined && (
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {enrollmentsCount} alunos
                </span>
              )}
              {modulesCount !== undefined && (
                <span className="inline-flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  {modulesCount} módulos
                </span>
              )}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.slice(0, 6).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
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
