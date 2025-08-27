import {
  IconBell,
  IconBook,
  IconBrain,
  IconCertificate,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconHelp,
  IconMedal,
  IconMessage,
  IconPlaylist,
  IconReport,
  IconSearch,
  IconSettings,
  IconShare,
  IconStar,
  IconTarget,
  IconTrendingUp,
  IconTrophy,
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react";

export const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Cursos",
      url: "/admin/dashboard/courses",
      icon: IconBook,
    },
    {
      title: "Categorias",
      url: "/admin/dashboard/categories",
      icon: IconDatabase,
    },
    {
      title: "Meu Progresso",
      url: "/admin/dashboard/progress",
      icon: IconTrendingUp,
    },
    {
      title: "Gamificação",
      url: "/admin/dashboard/gamification",
      icon: IconTrophy,
    },
    {
      title: "Rede Social",
      url: "/admin/dashboard/social",
      icon: IconShare,
    },
    {
      title: "Comunidades",
      url: "/admin/dashboard/communities",
      icon: IconUsersGroup,
    },
    {
      title: "Mensagens",
      url: "/admin/dashboard/messages",
      icon: IconMessage,
    },
    {
      title: "Certificados",
      url: "/admin/dashboard/certificates",
      icon: IconCertificate,
    },
    {
      title: "Quizzes",
      url: "/admin/dashboard/quizzes",
      icon: IconBrain,
    },
    {
      title: "Avaliações",
      url: "/admin/dashboard/reviews",
      icon: IconStar,
    },
    {
      title: "Notificações",
      url: "/admin/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Playlists",
      url: "/admin/dashboard/playlists",
      icon: IconPlaylist,
    },
    {
      title: "Analytics",
      url: "/admin/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Projetos",
      url: "/admin/dashboard/projects",
      icon: IconTarget,
    },
    {
      title: "Mentoria",
      url: "/admin/dashboard/mentorship",
      icon: IconUserCheck,
    },
    {
      title: "Competições",
      url: "/admin/dashboard/competitions",
      icon: IconMedal,
    },
  ],
  navClouds: [
    {
      title: "Cursos Ativos",
      icon: IconBook,
      isActive: true,
      url: "/admin/dashboard/courses/active",
      items: [
        {
          title: "Em Andamento",
          url: "/admin/dashboard/courses/in-progress",
        },
        {
          title: "Concluídos",
          url: "/admin/dashboard/courses/completed",
        },
        {
          title: "Favoritos",
          url: "/admin/dashboard/courses/favorites",
        },
      ],
    },
    {
      title: "Conquistas",
      icon: IconTrophy,
      url: "/admin/dashboard/achievements",
      items: [
        {
          title: "Badges",
          url: "/admin/dashboard/achievements/badges",
        },
        {
          title: "Níveis",
          url: "/admin/dashboard/achievements/levels",
        },
        {
          title: "Histórico XP",
          url: "/admin/dashboard/achievements/xp",
        },
      ],
    },
    {
      title: "Comunidades",
      icon: IconUsersGroup,
      url: "/admin/dashboard/communities",
      items: [
        {
          title: "Minhas Comunidades",
          url: "/admin/dashboard/communities/my",
        },
        {
          title: "Descobrir",
          url: "/admin/dashboard/communities/discover",
        },
        {
          title: "Criar Comunidade",
          url: "/admin/dashboard/communities/create",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/admin/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "/admin/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "/admin/dashboard/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Biblioteca de Recursos",
      url: "/admin/dashboard/resources",
      icon: IconDatabase,
    },
    {
      name: "Relatórios",
      url: "/admin/dashboard/reports",
      icon: IconReport,
    },
    {
      name: "Assistente de Estudo",
      url: "/admin/dashboard/assistant",
      icon: IconFileAi,
    },
  ],
};
