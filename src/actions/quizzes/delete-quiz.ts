"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteQuiz(id: string) {
  try {
    // Verificar se o quiz existe
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
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
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      return {
        success: false,
        error: "Quiz não encontrado",
      };
    }

    // Verificar se há tentativas de quiz
    if (existingQuiz._count.attempts > 0) {
      return {
        success: false,
        error:
          "Não é possível excluir um quiz que possui tentativas de usuários",
      };
    }

    // Deletar o quiz (as questões serão deletadas automaticamente devido ao cascade)
    await prisma.quiz.delete({
      where: { id },
    });

    // Revalidar cache
    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath(
      `/admin/dashboard/courses/${existingQuiz.module.course.slug}/modules/${existingQuiz.module.slug}`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao deletar quiz:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
