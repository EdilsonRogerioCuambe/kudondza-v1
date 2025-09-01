"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateQuizSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  title: z.string().min(1, "Título é obrigatório").optional(),
  description: z.string().optional(),
  timeLimit: z.number().min(1).optional(),
  passingScore: z.number().min(0).max(100).optional(),
  maxAttempts: z.number().min(1).optional(),
  shuffleQuestions: z.boolean().optional(),
  showResults: z.boolean().optional(),
  xpReward: z.number().min(0).optional(),
  allowedQuestionTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de questão")
    .optional(),
});

export type UpdateQuizInput = z.infer<typeof UpdateQuizSchema>;

export async function updateQuiz(data: UpdateQuizInput) {
  try {
    const validatedData = UpdateQuizSchema.parse(data);

    // Verificar se o quiz existe
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: validatedData.id },
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

    if (!existingQuiz) {
      return {
        success: false,
        error: "Quiz não encontrado",
      };
    }

    // Atualizar o quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        timeLimit: validatedData.timeLimit,
        passingScore: validatedData.passingScore,
        maxAttempts: validatedData.maxAttempts,
        shuffleQuestions: validatedData.shuffleQuestions,
        showResults: validatedData.showResults,
        xpReward: validatedData.xpReward,
        allowedQuestionTypes: validatedData.allowedQuestionTypes,
      },
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
              },
            },
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

    // Revalidar cache
    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath(`/admin/dashboard/quizzes/${updatedQuiz.id}`);
    revalidatePath(
      `/admin/dashboard/courses/${existingQuiz.module.course.slug}/modules/${existingQuiz.module.slug}`
    );

    return {
      success: true,
      data: updatedQuiz,
    };
  } catch (error) {
    console.error("Erro ao atualizar quiz:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
