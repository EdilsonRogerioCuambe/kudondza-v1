"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateQuestionSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  title: z.string().min(1, "Título é obrigatório").optional(),
  explanation: z.string().optional(),
  points: z.number().min(1).optional(),
  options: z.array(z.string()).optional(),
  correctAnswers: z.array(z.union([z.string(), z.number()])).optional(),
});

export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>;

export async function updateQuestion(data: UpdateQuestionInput) {
  try {
    const validatedData = UpdateQuestionSchema.parse(data);

    // Verificar se a questão existe
    const existingQuestion = await prisma.question.findUnique({
      where: { id: validatedData.id },
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

    // Atualizar a questão
    const updatedQuestion = await prisma.question.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        explanation: validatedData.explanation,
        points: validatedData.points,
        options: validatedData.options,
        correctAnswers: validatedData.correctAnswers,
      },
    });

    // Revalidar cache
    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath(`/admin/dashboard/quizzes/${existingQuestion.quiz.id}`);
    revalidatePath(`/admin/dashboard/courses/${existingQuestion.quiz.module.course.slug}/modules/${existingQuestion.quiz.module.slug}`);

    return {
      success: true,
      data: updatedQuestion,
    };
  } catch (error) {
    console.error("Erro ao atualizar questão:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
