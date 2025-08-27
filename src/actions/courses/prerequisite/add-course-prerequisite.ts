"use server";

import prisma from "@/lib/prisma";
import {
  CreateCoursePrerequisiteInput,
  CreateCoursePrerequisiteSchema,
} from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

/**
 * Adiciona um pré-requisito a um curso
 */
export async function addCoursePrerequisite(
  data: CreateCoursePrerequisiteInput
) {
  try {
    const validatedData = CreateCoursePrerequisiteSchema.parse(data);

    // Verificar se o pré-requisito já existe
    const existingPrerequisite = await prisma.coursePrerequisite.findUnique({
      where: {
        unique_course_prerequisite: {
          courseId: validatedData.courseId,
          prerequisiteId: validatedData.prerequisiteId,
        },
      },
    });

    if (existingPrerequisite) {
      throw new Error("Este pré-requisito já foi adicionado");
    }

    // Verificar se não está tentando adicionar o próprio curso como pré-requisito
    if (validatedData.courseId === validatedData.prerequisiteId) {
      throw new Error("Um curso não pode ser pré-requisito de si mesmo");
    }

    const prerequisite = await prisma.coursePrerequisite.create({
      data: validatedData,
      include: {
        prerequisite: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
          },
        },
      },
    });

    revalidatePath(`/admin/courses/${validatedData.courseId}`);
    return { success: true, data: prerequisite };
  } catch (error) {
    console.error("Erro ao adicionar pré-requisito:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
