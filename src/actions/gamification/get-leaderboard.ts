"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getLeaderboard() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Buscar top 10 usuários por XP
    const topUsers = await prisma.gamification.findMany({
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { totalXP: "desc" },
    });

    // Buscar dados do usuário atual
    const currentUser = await prisma.gamification.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Calcular posição do usuário atual
    const allUsers = await prisma.gamification.findMany({
      select: { userId: true, totalXP: true },
      orderBy: { totalXP: "desc" },
    });

    const userRank = allUsers.findIndex((user) => user.userId === userId) + 1;

    // Mapear dados do leaderboard
    const leaderboard = topUsers.map((user, index) => {
      const isCurrentUser = user.userId === userId;

      return {
        name: isCurrentUser ? "Você" : user.user.name,
        level: user.currentLevel,
        xp: user.totalXP,
        rank: index + 1,
        avatar: getAvatarByLevel(user.currentLevel),
        isCurrentUser,
      };
    });

    // Adicionar usuário atual se não estiver no top 10
    if (userRank > 10 && currentUser) {
      leaderboard.push({
        name: "Você",
        level: currentUser.currentLevel,
        xp: currentUser.totalXP,
        rank: userRank,
        avatar: getAvatarByLevel(currentUser.currentLevel),
        isCurrentUser: true,
      });
    }

    return {
      leaderboard,
      userRank,
      totalUsers: allUsers.length,
    };
  } catch (error) {
    console.error("Erro ao buscar leaderboard:", error);
    throw new Error("Falha ao carregar leaderboard");
  }
}

function getAvatarByLevel(level: number): string {
  if (level >= 25) return "👑";
  if (level >= 20) return "⭐";
  if (level >= 15) return "🎯";
  if (level >= 10) return "👨‍💻";
  if (level >= 5) return "👩‍💻";
  return "👨‍🎓";
}
