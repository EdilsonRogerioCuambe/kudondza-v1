"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateQuizSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  moduleId: z.string().min(1, "Módulo é obrigatório"),
  timeLimit: z.number().min(1).optional(),
  passingScore: z.number().min(0).max(100).default(70),
  maxAttempts: z.number().min(1).default(3),
  shuffleQuestions: z.boolean().default(true),
  showResults: z.boolean().default(true),
  xpReward: z.number().min(0).default(100),
  allowedQuestionTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de questão"),
});

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;

export async function createQuiz(data: CreateQuizInput) {
  try {
    const validatedData = CreateQuizSchema.parse(data);

    // Verificar se o módulo existe
    const moduleData = await prisma.module.findUnique({
      where: { id: validatedData.moduleId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!moduleData) {
      return {
        success: false,
        error: "Módulo não encontrado",
      };
    }

    // Calcular próxima ordem
    const lastQuiz = await prisma.quiz.findFirst({
      where: { moduleId: validatedData.moduleId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (lastQuiz?.order ?? 0) + 1;

    // Criar o quiz
    const quiz = await prisma.quiz.create({
      data: {
        ...validatedData,
        order: nextOrder,
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
    revalidatePath(
      `/admin/dashboard/courses/${moduleData.course.slug}/modules/${moduleData.slug}`
    );

    return {
      success: true,
      data: quiz,
    };
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
