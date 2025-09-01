"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteQuestion(id: string) {
  try {
    // Verificar se a questão existe
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
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
        },
      },
    });

    if (!existingQuestion) {
      return {
        success: false,
        error: "Questão não encontrada",
      };
    }

    // Deletar a questão
    await prisma.question.delete({
      where: { id },
    });

    // Reordenar as questões restantes
    const remainingQuestions = await prisma.question.findMany({
      where: { quizId: existingQuestion.quiz.id },
      orderBy: { order: "asc" },
      select: { id: true },
    });

    // Atualizar a ordem das questões restantes
    await prisma.$transaction(
      remainingQuestions.map((question, index) =>
        prisma.question.update({
          where: { id: question.id },
          data: { order: index + 1 },
        })
      )
    );

    // Revalidar cache
    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath(`/admin/dashboard/quizzes/${existingQuestion.quiz.id}`);
    revalidatePath(`/admin/dashboard/courses/${existingQuestion.quiz.module.course.slug}/modules/${existingQuestion.quiz.module.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao deletar questão:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
