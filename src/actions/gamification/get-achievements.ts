"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getAchievementsWithProgress() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Buscar todas as conquistas disponíveis
    const allBadges = await prisma.badge.findMany({
      where: { isActive: true },
      orderBy: { rarity: "asc" },
    });

    // Buscar conquistas desbloqueadas pelo usuário
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
    });

    // Buscar dados de gamificação para calcular progresso
    const gamification = await prisma.gamification.findUnique({
      where: { userId },
    });

    // Buscar matrículas para calcular progresso de cursos
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
    });

    // Buscar analytics para calcular tempo de estudo
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Mapear conquistas com progresso
    const achievements = allBadges.map((badge) => {
      const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
      const earned = !!userBadge;

      // Calcular progresso baseado no tipo de conquista
      let progress = 0;
      let target = 0;

      if (!earned) {
        // Determinar critérios baseado no nome da badge
        if (
          badge.name.includes("Primeiro") ||
          badge.name.includes("Primeira")
        ) {
          target = 1;
          progress = enrollments.filter((e) => e.status === "COMPLETED").length;
        } else if (
          badge.name.includes("Dedicado") ||
          badge.name.includes("Streak")
        ) {
          target = 7;
          progress = gamification?.currentStreak || 0;
        } else if (badge.name.includes("Especialista")) {
          target = 10;
          progress = enrollments.filter((e) => e.status === "COMPLETED").length;
        } else if (badge.name.includes("Maratonista")) {
          target = 30;
          progress = gamification?.currentStreak || 0;
        } else if (badge.name.includes("Mestre")) {
          target = 50;
          progress = enrollments.filter((e) => e.status === "COMPLETED").length;
        } else if (badge.name.includes("Inovador")) {
          target = 5;
          progress = 2; // Simulado
        }
      }

      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: getBadgeIcon(badge.name),
        xp: badge.xpReward,
        earned,
        date: userBadge?.earnedAt,
        rarity: badge.rarity.toLowerCase(),
        progress: earned ? undefined : progress,
        target: earned ? undefined : target,
      };
    });

    return achievements;
  } catch (error) {
    console.error("Erro ao buscar conquistas:", error);
    throw new Error("Falha ao carregar conquistas");
  }
}

function getBadgeIcon(badgeName: string): string {
  const iconMap: Record<string, string> = {
    Primeiro: "🎓",
    Primeira: "🎓",
    Dedicado: "🔥",
    Especialista: "⭐",
    Maratonista: "🏃",
    Mestre: "👑",
    Inovador: "💡",
    Perfeccionista: "💎",
    Social: "👥",
    Mentor: "🎯",
    Persistente: "🔄",
    Velocista: "⚡",
    Curioso: "🔍",
    Colaborador: "🤝",
    Líder: "👑",
    Criativo: "🎨",
    Analítico: "📊",
    Comunicador: "📢",
    Resolvedor: "🧩",
    Adaptável: "🦎",
    Focado: "🎯",
    Organizado: "📋",
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (badgeName.includes(key)) {
      return icon;
    }
  }

  return "🏆";
}
