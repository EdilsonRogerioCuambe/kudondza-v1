"use client";

import { useActiveRoute } from "@/hooks/use-active-route";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";

interface SidebarIndicatorProps {
  className?: string;
  showProgress?: boolean;
}

export function SidebarIndicator({
  className,
  showProgress = true,
}: SidebarIndicatorProps) {
  const { activeRoute, pathname } = useActiveRoute();

  const getRouteProgress = () => {
    const segments = pathname.split("/").filter(Boolean);

    // Se estamos no dashboard principal
    if (segments.length === 2) {
      return { current: 1, total: 1, label: "Dashboard" };
    }

    // Se estamos em uma rota específica
    if (segments.length >= 3) {
      const routeNames: Record<string, string> = {
        courses: "Cursos",
        categories: "Categorias",
        communities: "Comunidades",
        settings: "Configurações",
        users: "Usuários",
        certificates: "Certificados",
        gamification: "Gamificação",
        progress: "Progresso",
        reports: "Relatórios",
        analytics: "Analytics",
        quizzes: "Questionários",
        reviews: "Avaliações",
        messages: "Mensagens",
        notifications: "Notificações",
        playlists: "Playlists",
        projects: "Projetos",
        mentorship: "Mentoria",
        competitions: "Competições",
        social: "Rede Social",
        help: "Ajuda",
        search: "Buscar",
        resources: "Recursos",
        assistant: "Assistente",
      };

      const currentSegment = segments[2];
      const currentName = routeNames[currentSegment] || currentSegment;

      return {
        current: 2,
        total: segments.length,
        label: currentName,
      };
    }

    return { current: 1, total: 1, label: "Dashboard" };
  };

  const progress = getRouteProgress();

  if (!showProgress) {
    return null;
  }

  return (
    <div className={cn("px-4 py-2", className)}>
      {/* Indicador de Progresso */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span className="font-medium">Navegação</span>
        <span className="flex items-center gap-1">
          <span>{progress.current}</span>
          <IconChevronRight className="h-3 w-3" />
          <span>{progress.total}</span>
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${(progress.current / progress.total) * 100}%`,
          }}
        />
      </div>

      {/* Rota Atual */}
      <div className="mt-2 text-xs text-muted-foreground">
        <span className="font-medium">Atual:</span> {progress.label}
      </div>

      {/* Breadcrumb Mínimo */}
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <span className="text-primary">Dashboard</span>
        {progress.current > 1 && (
          <>
            <IconChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">
              {progress.label}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar o status da rota atual
export function RouteStatus({ className }: { className?: string }) {
  const { activeRoute, isExactMatch } = useActiveRoute();

  const getRouteStatus = () => {
    if (isExactMatch(activeRoute)) {
      return {
        status: "active",
        label: "Página Atual",
        color: "text-green-500",
      };
    }

    const segments = activeRoute.split("/").filter(Boolean);
    if (segments.length > 2) {
      return {
        status: "section",
        label: "Seção Ativa",
        color: "text-blue-500",
      };
    }

    return {
      status: "dashboard",
      label: "Dashboard",
      color: "text-muted-foreground",
    };
  };

  const routeStatus = getRouteStatus();

  return (
    <div className={cn("px-4 py-2 border-t", className)}>
      <div className="flex items-center gap-2 text-xs">
        <div className={cn("w-2 h-2 rounded-full", routeStatus.color)} />
        <span className={cn("font-medium", routeStatus.color)}>
          {routeStatus.label}
        </span>
      </div>
    </div>
  );
}
