"use client";

import { cn } from "@/lib/utils";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  maxItems?: number;
}

export function Breadcrumbs({
  items,
  className,
  separator = <IconChevronRight className="h-3 w-3 text-muted-foreground/50" />,
  maxItems = 5,
}: BreadcrumbsProps) {

  // Limitar o número de itens para evitar overflow
  const visibleItems =
    items.length > maxItems
      ? [...items.slice(0, 2), ...items.slice(-2)]
      : items;

  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const content = (
      <div className="flex items-center gap-1">
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span className="truncate">{item.label}</span>
      </div>
    );

    if (isLast || item.isActive) {
      return (
        <span
          key={item.path}
          className={cn(
            "text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-[150px] lg:max-w-[200px]",
            className
          )}
          title={item.label}
        >
          {content}
        </span>
      );
    }

    return (
      <Link
        key={item.path}
        href={item.path}
        className={cn(
          "text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer truncate max-w-[120px] sm:max-w-[150px] lg:max-w-[200px]",
          className
        )}
        title={item.label}
      >
        {content}
      </Link>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {visibleItems.map((item, index) => (
        <div key={item.path} className="flex items-center gap-1">
          {index > 0 && (
            <span className="mx-1 flex-shrink-0" aria-hidden="true">
              {separator}
            </span>
          )}
          {renderItem(item, index, index === visibleItems.length - 1)}
        </div>
      ))}

      {/* Indicador de truncamento */}
      {items.length > maxItems && (
        <>
          <span className="mx-1 flex-shrink-0" aria-hidden="true">
            {separator}
          </span>
          <span className="text-sm text-muted-foreground">...</span>
        </>
      )}
    </nav>
  );
}

// Componente específico para o dashboard
export function DashboardBreadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Sempre começar com Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <IconHome className="h-3 w-3" />,
      isActive: segments.length === 2,
    });

    // Se estamos em uma rota específica, adicionar os segmentos
    if (segments.length > 2) {
      let currentPath = "/admin/dashboard";

      for (let i = 2; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;

        // Mapear nomes amigáveis para os segmentos
        const friendlyNames: Record<string, string> = {
          // Cursos
          courses: "Cursos",
          create: "Criar",
          edit: "Editar",
          modules: "Módulos",
          lessons: "Aulas",
          quizzes: "Questionários",

          // Categorias
          categories: "Categorias",
          subcategories: "Subcategorias",

          // Comunidades
          communities: "Comunidades",
          events: "Eventos",
          polls: "Enquetes",
          posts: "Posts",

          // Usuários e Sistema
          users: "Usuários",
          settings: "Configurações",
          certificates: "Certificados",
          gamification: "Gamificação",
          progress: "Progresso",
          reports: "Relatórios",
          analytics: "Analytics",

          // Outros
          dashboard: "Dashboard",
          admin: "Admin",
        };

        const label =
          friendlyNames[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);

        breadcrumbs.push({
          label,
          path: currentPath,
          isActive: i === segments.length - 1,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumbs
      items={breadcrumbs}
      className="text-muted-foreground"
      maxItems={6}
    />
  );
}
