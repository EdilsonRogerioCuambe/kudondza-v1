"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Destacar/remover destaque de um curso
 */
export async function toggleCourseFeatured(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        isFeatured: !course.isFeatured,
        featuredAt: !course.isFeatured ? new Date() : null,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${course.slug}`);
    return { success: true, data: updatedCourse };
  } catch (error) {
    console.error("Erro ao alterar destaque do curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
