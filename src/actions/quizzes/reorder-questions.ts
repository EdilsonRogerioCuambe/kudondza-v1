"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reorderQuestions(quizId: string, questionIds: string[]) {
  try {
    // Verificar se o quiz existe
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        module: {
          select: {
            course: {
              select: {
                slug: true,
              },
            },
            slug: true,
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

    // Verificar se todas as questões pertencem ao quiz
    const questions = await prisma.question.findMany({
      where: { quizId },
      select: { id: true },
    });

    const validQuestionIds = questions.map(q => q.id);
    const hasInvalidQuestions = questionIds.some(id => !validQuestionIds.includes(id));

    if (hasInvalidQuestions) {
      return {
        success: false,
        error: "Algumas questões não pertencem ao quiz",
      };
    }

    // Reordenar as questões
    await prisma.$transaction(
      questionIds.map((questionId, index) =>
        prisma.question.update({
          where: { id: questionId },
          data: { order: index + 1 },
        })
      )
    );

    // Revalidar cache
    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath(`/admin/dashboard/quizzes/${quizId}`);
    revalidatePath(`/admin/dashboard/courses/${quiz.module.course.slug}/modules/${quiz.module.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao reordenar questões:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
