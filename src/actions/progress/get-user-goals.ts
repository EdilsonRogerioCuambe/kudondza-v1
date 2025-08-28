"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserGoals() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Buscar metas ativas do usuário
    const goals = await prisma.userGoal.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { startDate: "desc" },
    });

    // Buscar dados de gamificação para calcular progresso
    const gamification = await prisma.gamification.findUnique({
      where: { userId },
    });

    // Buscar analytics da semana atual
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

    // Calcular tempo total da semana
    const weeklyStudyTime =
      weeklyAnalytics.reduce((acc, analytics) => acc + analytics.timeSpent, 0) /
      3600; // Converter para horas

    // Mapear metas com progresso atual
    const goalsWithProgress = goals.map((goal) => {
      let current = goal.current;

      // Atualizar progresso baseado no tipo da meta
      switch (goal.type) {
        case "STUDY_TIME":
          if (goal.period === "WEEKLY") {
            current = Math.round(weeklyStudyTime);
          }
          break;
        case "XP_EARNED":
          if (gamification) {
            current = gamification.totalXP;
          }
          break;
        case "STREAK_DAYS":
          if (gamification) {
            current = gamification.currentStreak;
          }
          break;
        case "COURSES_COMPLETED":
          // Buscar cursos completados
          break;
        case "LESSONS_COMPLETED":
          // Buscar aulas completadas
          break;
        case "BADGES_EARNED":
          // Buscar badges conquistadas
          break;
      }

      const progress =
        goal.target > 0 ? Math.min((current / goal.target) * 100, 100) : 0;
      const isCompleted = current >= goal.target;

      return {
        ...goal,
        current,
        progress: Math.round(progress),
        isCompleted,
      };
    });

    return goalsWithProgress;
  } catch (error) {
    console.error("Erro ao buscar metas do usuário:", error);
    throw new Error("Falha ao carregar metas");
  }
}

export async function createUserGoal(data: {
  title: string;
  description?: string;
  type: string;
  target: number;
  unit: string;
  isRecurring?: boolean;
  period?: string;
  endDate?: Date;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    const goal = await prisma.userGoal.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type as
          | "STUDY_TIME"
          | "XP_EARNED"
          | "STREAK_DAYS"
          | "COURSES_COMPLETED"
          | "LESSONS_COMPLETED"
          | "BADGES_EARNED",
        target: data.target,
        unit: data.unit,
        isRecurring: data.isRecurring || false,
        period: data.period as "DAILY" | "WEEKLY" | "MONTHLY" | undefined,
        endDate: data.endDate,
        userId,
      },
    });

    return goal;
  } catch (error) {
    console.error("Erro ao criar meta:", error);
    throw new Error("Falha ao criar meta");
  }
}

export async function updateUserGoal(
  goalId: string,
  data: {
    title?: string;
    description?: string;
    target?: number;
    unit?: string;
    isActive?: boolean;
  }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Verificar se a meta pertence ao usuário
    const existingGoal = await prisma.userGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existingGoal) {
      throw new Error("Meta não encontrada");
    }

    const goal = await prisma.userGoal.update({
      where: { id: goalId },
      data,
    });

    return goal;
  } catch (error) {
    console.error("Erro ao atualizar meta:", error);
    throw new Error("Falha ao atualizar meta");
  }
}

export async function deleteUserGoal(goalId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Verificar se a meta pertence ao usuário
    const existingGoal = await prisma.userGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existingGoal) {
      throw new Error("Meta não encontrada");
    }

    await prisma.userGoal.delete({
      where: { id: goalId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar meta:", error);
    throw new Error("Falha ao deletar meta");
  }
}
