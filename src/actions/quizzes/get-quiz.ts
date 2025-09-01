"use server";

import prisma from "@/lib/prisma";

export async function getQuiz(id: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            slug: true,
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            type: true,
            explanation: true,
            points: true,
            order: true,
            options: true,
            correctAnswers: true,
          },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: "Quiz não encontrado",
      };
    }

    return {
      success: true,
      data: quiz,
    };
  } catch (error) {
    console.error("Erro ao buscar quiz:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
