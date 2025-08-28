"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getLevelRewards() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Buscar dados de gamificação do usuário
    const gamification = await prisma.gamification.findUnique({
      where: { userId },
    });

    if (!gamification) {
      return [];
    }

    // Buscar recompensas de nível próximas
    const nextLevels = [
      gamification.currentLevel + 1,
      gamification.currentLevel + 5,
      gamification.currentLevel + 10,
    ];

    const levelRewards = await prisma.levelReward.findMany({
      where: {
        level: {
          in: nextLevels,
        },
        isActive: true,
      },
      orderBy: { level: "asc" },
    });

    // Buscar recompensas já ganhas pelo usuário
    const userRewards = await prisma.userLevelReward.findMany({
      where: { userId },
      include: {
        levelReward: true,
      },
    });

    // Mapear recompensas
    const rewards = levelRewards.map((reward) => {
      const userReward = userRewards.find(
        (ur) => ur.levelRewardId === reward.id
      );
      const earned = !!userReward;
      const xpNeeded =
        (reward.level - gamification.currentLevel) * gamification.xpToNextLevel;

      return {
        level: reward.level,
        title: reward.title,
        description: reward.description,
        type: reward.type,
        value: reward.value,
        xpReward: reward.xpReward,
        earned,
        xpNeeded,
        icon: getRewardIcon(reward.type),
      };
    });

    // Se não há recompensas configuradas, criar algumas padrão
    if (rewards.length === 0) {
      return [
        {
          level: gamification.currentLevel + 1,
          title: "Rocket Learner",
          description: "Badge especial para o próximo nível",
          type: "BADGE",
          value: "Rocket Learner",
          xpReward: 100,
          earned: false,
          xpNeeded: gamification.xpToNextLevel,
          icon: "🚀",
        },
        {
          level: gamification.currentLevel + 5,
          title: "Diamond Coder",
          description: "Título exclusivo para programadores dedicados",
          type: "TITLE",
          value: "Diamond Coder",
          xpReward: 500,
          earned: false,
          xpNeeded: gamification.xpToNextLevel * 5,
          icon: "💎",
        },
        {
          level: gamification.currentLevel + 10,
          title: "Master Mind",
          description: "Conquista suprema para mestres do conhecimento",
          type: "BADGE",
          value: "Master Mind",
          xpReward: 1000,
          earned: false,
          xpNeeded: gamification.xpToNextLevel * 10,
          icon: "🧠",
        },
      ];
    }

    return rewards;
  } catch (error) {
    console.error("Erro ao buscar recompensas de nível:", error);
    throw new Error("Falha ao carregar recompensas de nível");
  }
}

function getRewardIcon(type: string): string {
  switch (type) {
    case "BADGE":
      return "🏆";
    case "TITLE":
      return "👑";
    case "XP_BONUS":
      return "⭐";
    case "FEATURE_UNLOCK":
      return "🔓";
    case "CUSTOM_AVATAR":
      return "🎭";
    case "CERTIFICATE":
      return "📜";
    default:
      return "🎁";
  }
}
