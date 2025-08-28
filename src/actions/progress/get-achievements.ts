"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserAchievements() {
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

    // Mapear conquistas com status de desbloqueio
    const achievements = allBadges.map((badge) => {
      const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: getBadgeIcon(badge.name),
        earned: !!userBadge,
        earnedAt: userBadge?.earnedAt,
        rarity: badge.rarity,
        xpReward: badge.xpReward,
        color: badge.color,
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
    "Primeiro Curso": "🎓",
    "Estudante Dedicado": "🔥",
    Especialista: "⭐",
    Maratonista: "🏃",
    Perfeccionista: "💎",
    Social: "👥",
    Mentor: "🎯",
    Inovador: "💡",
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

  return iconMap[badgeName] || "🏆";
}
