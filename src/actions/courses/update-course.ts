"use server";

import prisma from "@/lib/prisma";
import { UpdateCourseInput, UpdateCourseSchema } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

/**
 * Atualiza um curso
 */
export async function updateCourse(data: UpdateCourseInput) {
  try {
    // Validar dados de entrada
    const validatedData = UpdateCourseSchema.parse(data);

    // Verificar se o curso existe
    const existingCourse = await prisma.course.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingCourse) {
      throw new Error("Curso não encontrado");
    }

    // Verificar se o slug já existe (se foi alterado)
    if (validatedData.slug && validatedData.slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        throw new Error("Já existe um curso com este slug");
      }
    }

    // Preparar dados para atualização
    const updateData: Partial<UpdateCourseInput> = { ...validatedData };
    delete updateData.id;

    // Atualizar o curso
    const course = await prisma.course.update({
      where: { id: validatedData.id },
      data: {
        ...updateData,
        tags: validatedData.tags || existingCourse.tags,
        seoKeywords: validatedData.seoKeywords || existingCourse.seoKeywords,
        unlockCriteria:
          validatedData.unlockCriteria ||
          existingCourse.unlockCriteria ||
          undefined,
        publishedAt:
          validatedData.status === "PUBLISHED" && !existingCourse.publishedAt
            ? new Date()
            : validatedData.publishedAt || existingCourse.publishedAt,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
            reviews: true,
            certificates: true,
          },
        },
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${course.slug}`);
    return { success: true, data: course };
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
