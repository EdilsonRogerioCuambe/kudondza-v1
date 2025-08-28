"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getCommunityRanking() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Buscar dados de gamificação do usuário atual
    const userGamification = await prisma.gamification.findUnique({
      where: { userId },
    });

    if (!userGamification) {
      return {
        userRank: 0,
        totalUsers: 0,
        userPoints: 0,
        nextLevelPoints: 0,
        topPercentage: 0,
      };
    }

    // Calcular pontos totais do usuário
    const userPoints = userGamification.totalXP;

    // Buscar todos os usuários ordenados por XP
    const allUsers = await prisma.gamification.findMany({
      select: {
        userId: true,
        totalXP: true,
      },
      orderBy: { totalXP: "desc" },
    });

    // Encontrar posição do usuário
    const userRank = allUsers.findIndex((user) => user.userId === userId) + 1;
    const totalUsers = allUsers.length;

    // Calcular porcentagem do topo
    const topPercentage =
      totalUsers > 0 ? Math.round((userRank / totalUsers) * 100) : 0;

    // Calcular pontos para o próximo nível
    const nextLevelPoints = userGamification.xpToNextLevel;

    // Buscar top 10 usuários para exibição
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

    return {
      userRank,
      totalUsers,
      userPoints,
      nextLevelPoints,
      topPercentage,
      topUsers: topUsers.map((user, index) => ({
        rank: index + 1,
        name: user.user.name,
        image: user.user.image,
        points: user.totalXP,
        level: user.currentLevel,
      })),
    };
  } catch (error) {
    console.error("Erro ao buscar ranking da comunidade:", error);
    throw new Error("Falha ao carregar ranking da comunidade");
  }
}
