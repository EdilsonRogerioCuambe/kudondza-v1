"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserGamification() {
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
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });

    if (!gamification) {
      // Criar dados de gamificação se não existir
      const newGamification = await prisma.gamification.create({
        data: {
          userId,
          totalXP: 0,
          currentLevel: 1,
          xpToNextLevel: 500,
          currentStreak: 0,
          longestStreak: 0,
          coursesCompleted: 0,
          lessonsCompleted: 0,
          quizzesCompleted: 0,
          certificatesEarned: 0,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          badges: {
            include: {
              badge: true,
            },
          },
        },
      });
      return formatGamificationData(newGamification);
    }

    return formatGamificationData(gamification);
  } catch (error) {
    console.error("Erro ao buscar dados de gamificação:", error);
    throw new Error("Falha ao carregar dados de gamificação");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatGamificationData(gamification: any) {
  // Calcular XP atual do nível
  const currentXP = gamification.totalXP % gamification.xpToNextLevel;

  // Determinar rank baseado no nível
  const rank = getRankByLevel(gamification.currentLevel);

  // Calcular posição no ranking (simulado por enquanto)
  const position = Math.floor(Math.random() * 100) + 1;
  const totalUsers = 1247; // Simulado

  return {
    level: gamification.currentLevel,
    currentXP,
    xpToNextLevel: gamification.xpToNextLevel,
    totalXP: gamification.totalXP,
    rank,
    position,
    totalUsers,
    streak: gamification.currentStreak,
    achievements: gamification.badges.length,
    badges: gamification.badges.length,
    gamification,
  };
}

function getRankByLevel(level: number): string {
  if (level >= 25) return "Mestre Supremo";
  if (level >= 20) return "Mestre";
  if (level >= 15) return "Especialista";
  if (level >= 10) return "Avançado";
  if (level >= 5) return "Intermediário";
  return "Iniciante";
}
