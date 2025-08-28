"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getDailyChallenges() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Buscar desafios diários ativos
    const dailyChallenges = await prisma.dailyChallenge.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    // Buscar progresso do usuário nos desafios
    const userChallenges = await prisma.userChallenge.findMany({
      where: { userId },
      include: {
        challenge: true,
      },
    });

    // Buscar dados para calcular progresso
    const gamification = await prisma.gamification.findUnique({
      where: { userId },
    });

    // Buscar analytics da semana
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyAnalytics = await prisma.userAnalytics.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
        },
      },
    });

    const weeklyStudyTime =
      weeklyAnalytics.reduce((acc, analytics) => acc + analytics.timeSpent, 0) /
      3600; // Converter para horas

    // Buscar matrículas para calcular progresso
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
    });

    // Mapear desafios com progresso
    const challengesWithProgress = dailyChallenges.map((challenge) => {
      const userChallenge = userChallenges.find(
        (uc) => uc.challengeId === challenge.id
      );

      let progress = 0;
      let target = challenge.target;

      // Calcular progresso baseado no tipo de desafio
      switch (challenge.type) {
        case "STUDY_TIME":
          progress = Math.round(weeklyStudyTime);
          break;
        case "EXERCISE_COMPLETION":
          progress = Math.floor(Math.random() * 3) + 1; // Simulado
          break;
        case "LOGIN_STREAK":
          progress = gamification?.currentStreak || 0;
          break;
        case "COURSE_COMPLETION":
          progress = enrollments.filter((e) => e.status === "COMPLETED").length;
          break;
        case "LESSON_COMPLETION":
          progress = Math.floor(Math.random() * 5) + 1; // Simulado
          break;
        case "QUIZ_COMPLETION":
          progress = Math.floor(Math.random() * 3) + 1; // Simulado
          break;
        default:
          progress = userChallenge?.progress || 0;
      }

      const completed = progress >= target;
      const percentage = Math.min((progress / target) * 100, 100);

      return {
        title: challenge.title,
        reward: challenge.reward,
        progress,
        target,
        type: challenge.type.toLowerCase(),
        completed,
        percentage: Math.round(percentage),
      };
    });

    return challengesWithProgress;
  } catch (error) {
    console.error("Erro ao buscar desafios diários:", error);
    throw new Error("Falha ao carregar desafios diários");
  }
}
