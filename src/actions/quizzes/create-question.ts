"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateQuestionSchema = z.object({
  quizId: z.string().min(1, "Quiz ID é obrigatório"),
  title: z.string().min(1, "Título é obrigatório"),
  type: z.enum(["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY", "CODE", "ORDERING"]),
  explanation: z.string().optional(),
  points: z.number().min(1).default(1),
  options: z.array(z.string()).optional(),
  correctAnswers: z.array(z.union([z.string(), z.number()])).optional(),
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

export async function createQuestion(data: CreateQuestionInput) {
  try {
    const validatedData = CreateQuestionSchema.parse(data);

    // Verificar se o quiz existe
    const quiz = await prisma.quiz.findUnique({
      where: { id: validatedData.quizId },
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

    // Calcular próxima ordem
    const lastQuestion = await prisma.question.findFirst({
      where: { quizId: validatedData.quizId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (lastQuestion?.order ?? 0) + 1;

    // Validar opções baseado no tipo de questão
    if (["MULTIPLE_CHOICE", "MULTIPLE_SELECT"].includes(validatedData.type)) {
      if (!validatedData.options || validatedData.options.length < 2) {
        return {
          success: false,
          error: "Questões de múltipla escolha devem ter pelo menos 2 opções",
        };
      }
    }

    if (["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "TRUE_FALSE"].includes(validatedData.type)) {
      if (!validatedData.correctAnswers || validatedData.correctAnswers.length === 0) {
        return {
          success: false,
          error: "Questões devem ter pelo menos uma resposta correta",
        };
      }
    }

    // Criar a questão
    const question = await prisma.question.create({
      data: {
        quizId: validatedData.quizId,
        title: validatedData.title,
        type: validatedData.type,
        explanation: validatedData.explanation,
        points: validatedData.points,
        order: nextOrder,
        options: validatedData.options || [],
        correctAnswers: validatedData.correctAnswers || [],
      },
    });

    // Revalidar cache
    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath(`/admin/dashboard/quizzes/${validatedData.quizId}`);
    revalidatePath(`/admin/dashboard/courses/${quiz.module.course.slug}/modules/${quiz.module.slug}`);

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    console.error("Erro ao criar questão:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
