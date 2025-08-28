"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserProgress() {
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

    // Buscar matrículas do usuário
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            duration: true,
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    // Calcular progresso geral
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(
      (enrollment) => enrollment.status === "COMPLETED"
    ).length;
    const overallProgress =
      totalCourses > 0
        ? Math.round((completedCourses / totalCourses) * 100)
        : 0;

    // Buscar progresso das aulas
    const lessonProgress = await prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            module: {
              select: {
                id: true,
                title: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { lastAccessed: "desc" },
      take: 10,
    });

    // Calcular tempo total de estudo (aproximado)
    const totalStudyTime =
      lessonProgress.reduce((acc, progress) => acc + progress.timeSpent, 0) /
      3600; // Converter segundos para horas

    // Buscar analytics do usuário dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyAnalytics = await prisma.userAnalytics.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { date: "asc" },
    });

    // Calcular sequência atual
    const currentStreak = gamification?.currentStreak || 0;

    // Buscar conquistas desbloqueadas
    const earnedAchievements = gamification?.badges.length || 0;

    return {
      overallProgress,
      coursesCompleted: completedCourses,
      totalCourses,
      currentStreak,
      totalStudyTime: Math.round(totalStudyTime * 10) / 10, // Arredondar para 1 casa decimal
      achievements: earnedAchievements,
      weeklyGoal: 85, // Meta semanal padrão
      monthlyGoal: 320, // Meta mensal padrão
      recentCourses: enrollments.slice(0, 4).map((enrollment) => ({
        name: enrollment.course.title,
        progress: Math.round(Number(enrollment.progress)),
        status:
          enrollment.status === "COMPLETED"
            ? "Concluído"
            : enrollment.status === "ACTIVE"
            ? "Em andamento"
            : "Não iniciado",
        lastAccessed: enrollment.completedAt
          ? formatTimeAgo(enrollment.completedAt)
          : "Nunca",
      })),
      weeklyStats: weeklyAnalytics.map((analytics) => ({
        day: getDayName(analytics.date),
        hours: Math.round((analytics.timeSpent / 3600) * 10) / 10,
        goal: 3, // Meta diária padrão
      })),
      gamification,
      lessonProgress,
    };
  } catch (error) {
    console.error("Erro ao buscar progresso do usuário:", error);
    throw new Error("Falha ao carregar dados de progresso");
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Agora mesmo";
  if (diffInHours < 24) return `${diffInHours} horas atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 dia atrás";
  return `${diffInDays} dias atrás`;
}

function getDayName(date: Date): string {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return days[date.getDay()];
}
