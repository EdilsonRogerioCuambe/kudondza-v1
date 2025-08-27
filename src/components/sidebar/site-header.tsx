"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ui/theme-toggle";

function getPageTitle(pathname: string): string {
  const cleanPath = pathname.replace(/^\/dashboard\/?/, "");

  if (!cleanPath || cleanPath === "/") {
    return "Dashboard";
  }

  const routeTitles: Record<string, string> = {
    analytics: "Analytics",
    assistant: "Assistente",
    certificates: "Certificados",
    communities: "Comunidades",
    competitions: "Competições",
    courses: "Cursos",
    create: "Criar Curso",
    gamification: "Gamificação",
    help: "Ajuda",
    mentorship: "Mentoria",
    messages: "Mensagens",
    notifications: "Notificações",
    playlists: "Playlists",
    progress: "Progresso",
    projects: "Projetos",
    quizzes: "Questionários",
    reports: "Relatórios",
    resources: "Recursos",
    reviews: "Avaliações",
    search: "Pesquisa",
    settings: "Configurações",
    social: "Social",
  };

  const segment = cleanPath.split("/")[0];

  return (
    routeTitles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && pathname) {
      setPageTitle(getPageTitle(pathname));
    }
  }, [pathname, mounted]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {mounted && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </>
        )}
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
