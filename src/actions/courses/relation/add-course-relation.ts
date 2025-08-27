"use server";

import prisma from "@/lib/prisma";
import {
  CreateCourseRelationInput,
  CreateCourseRelationSchema,
} from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

/**
 * Adiciona um relacionamento entre cursos
 */
export async function addCourseRelation(data: CreateCourseRelationInput) {
  try {
    const validatedData = CreateCourseRelationSchema.parse(data);

    // Verificar se o relacionamento já existe
    const existingRelation = await prisma.courseRelation.findFirst({
      where: {
        sourceCourseId: validatedData.sourceCourseId,
        targetCourseId: validatedData.targetCourseId,
        type: validatedData.type,
      },
    });

    if (existingRelation) {
      throw new Error("Este relacionamento já existe");
    }

    // Verificar se não está tentando relacionar o curso consigo mesmo
    if (validatedData.sourceCourseId === validatedData.targetCourseId) {
      throw new Error("Um curso não pode se relacionar consigo mesmo");
    }

    const relation = await prisma.courseRelation.create({
      data: validatedData,
      include: {
        sourceCourse: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
            price: true,
          },
        },
        targetCourse: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
            price: true,
          },
        },
      },
    });

    revalidatePath(`/admin/courses/${validatedData.sourceCourseId}`);
    return { success: true, data: relation };
  } catch (error) {
    console.error("Erro ao adicionar relacionamento:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
