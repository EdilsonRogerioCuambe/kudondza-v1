"use client";

import { cn } from "@/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
  title?: string;
  description?: string;
  className?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{
    label: string;
    path: string;
    icon?: React.ReactNode;
  }>;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  className,
  showBreadcrumb = true,
  breadcrumbItems = [],
  actions,
}: PageHeaderProps) {
  const pathname = usePathname();

  const getPageInfo = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length < 3) {
      return {
        title: "Dashboard",
        description: "Visão geral da plataforma",
      };
    }

    const routeInfo: Record<string, { title: string; description: string }> = {
      // Cursos
      courses: {
        title: "Cursos",
        description: "Gerencie todos os cursos da plataforma",
      },
      create: {
        title: "Criar Curso",
        description: "Crie um novo curso para seus alunos",
      },
      edit: {
        title: "Editar Curso",
        description: "Modifique as informações do curso",
      },
      modules: {
        title: "Módulos",
        description: "Organize o conteúdo em módulos",
      },
      lessons: {
        title: "Aulas",
        description: "Gerencie as aulas do módulo",
      },
      quizzes: {
        title: "Questionários",
        description: "Crie e gerencie questionários",
      },

      // Categorias
      categories: {
        title: "Categorias",
        description: "Organize cursos por categorias",
      },
      subcategories: {
        title: "Subcategorias",
        description: "Subdivisões das categorias principais",
      },

      // Comunidades
      communities: {
        title: "Comunidades",
        description: "Gerencie comunidades de usuários",
      },
      events: {
        title: "Eventos",
        description: "Organize eventos da comunidade",
      },
      polls: {
        title: "Enquetes",
        description: "Crie enquetes para a comunidade",
      },
      posts: {
        title: "Posts",
        description: "Modere o conteúdo da comunidade",
      },

      // Usuários e Sistema
      users: {
        title: "Usuários",
        description: "Gerencie usuários da plataforma",
      },
      settings: {
        title: "Configurações",
        description: "Personalize suas preferências",
      },
      certificates: {
        title: "Certificados",
        description: "Gerencie certificados emitidos",
      },
      gamification: {
        title: "Gamificação",
        description: "Configure sistema de recompensas",
      },
      progress: {
        title: "Progresso",
        description: "Acompanhe o progresso dos usuários",
      },
      reports: {
        title: "Relatórios",
        description: "Visualize dados e estatísticas",
      },
      analytics: {
        title: "Analytics",
        description: "Análises detalhadas da plataforma",
      },
    };

    const segment = segments[2]; // Primeiro segmento após /admin/dashboard
    return (
      routeInfo[segment] || {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        description: `Gerencie ${segment}`,
      }
    );
  };

  const pageInfo = getPageInfo();
  const finalTitle = title || pageInfo.title;
  const finalDescription = description || pageInfo.description;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbItems.map((item, index) => (
            <div key={item.path} className="flex items-center gap-1">
              {index > 0 && (
                <IconChevronRight className="h-3 w-3 mx-1 text-muted-foreground/50" />
              )}
              <span className="truncate max-w-[120px] sm:max-w-[150px] lg:max-w-[200px]">
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      )}

      {/* Título e Descrição */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {finalTitle}
          </h1>
          {finalDescription && (
            <p className="text-muted-foreground mt-1">{finalDescription}</p>
          )}
        </div>

        {/* Ações */}
        {actions && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
