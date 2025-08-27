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
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Cursos",
      url: "/dashboard/courses",
      icon: IconBook,
    },
    {
      title: "Meu Progresso",
      url: "/dashboard/progress",
      icon: IconTrendingUp,
    },
    {
      title: "Gamificação",
      url: "/dashboard/gamification",
      icon: IconTrophy,
    },
    {
      title: "Rede Social",
      url: "/dashboard/social",
      icon: IconShare,
    },
    {
      title: "Comunidades",
      url: "/dashboard/communities",
      icon: IconUsersGroup,
    },
    {
      title: "Mensagens",
      url: "/dashboard/messages",
      icon: IconMessage,
    },
    {
      title: "Certificados",
      url: "/dashboard/certificates",
      icon: IconCertificate,
    },
    {
      title: "Quizzes",
      url: "/dashboard/quizzes",
      icon: IconBrain,
    },
    {
      title: "Avaliações",
      url: "/dashboard/reviews",
      icon: IconStar,
    },
    {
      title: "Notificações",
      url: "/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Playlists",
      url: "/dashboard/playlists",
      icon: IconPlaylist,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Projetos",
      url: "/dashboard/projects",
      icon: IconTarget,
    },
    {
      title: "Mentoria",
      url: "/dashboard/mentorship",
      icon: IconUserCheck,
    },
    {
      title: "Competições",
      url: "/dashboard/competitions",
      icon: IconMedal,
    },
  ],
  navClouds: [
    {
      title: "Cursos Ativos",
      icon: IconBook,
      isActive: true,
      url: "/dashboard/courses/active",
      items: [
        {
          title: "Em Andamento",
          url: "/dashboard/courses/in-progress",
        },
        {
          title: "Concluídos",
          url: "/dashboard/courses/completed",
        },
        {
          title: "Favoritos",
          url: "/dashboard/courses/favorites",
        },
      ],
    },
    {
      title: "Conquistas",
      icon: IconTrophy,
      url: "/dashboard/achievements",
      items: [
        {
          title: "Badges",
          url: "/dashboard/achievements/badges",
        },
        {
          title: "Níveis",
          url: "/dashboard/achievements/levels",
        },
        {
          title: "Histórico XP",
          url: "/dashboard/achievements/xp",
        },
      ],
    },
    {
      title: "Comunidades",
      icon: IconUsersGroup,
      url: "/dashboard/communities",
      items: [
        {
          title: "Minhas Comunidades",
          url: "/dashboard/communities/my",
        },
        {
          title: "Descobrir",
          url: "/dashboard/communities/discover",
        },
        {
          title: "Criar Comunidade",
          url: "/dashboard/communities/create",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Biblioteca de Recursos",
      url: "/dashboard/resources",
      icon: IconDatabase,
    },
    {
      name: "Relatórios",
      url: "/dashboard/reports",
      icon: IconReport,
    },
    {
      name: "Assistente de Estudo",
      url: "/dashboard/assistant",
      icon: IconFileAi,
    },
  ],
};
