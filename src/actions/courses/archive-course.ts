"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Arquivar um curso
 */
export async function archiveCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    if (course.status === "ARCHIVED") {
      throw new Error("Curso já está arquivado");
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: "ARCHIVED",
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${course.slug}`);
    return { success: true, data: updatedCourse };
  } catch (error) {
    console.error("Erro ao arquivar curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
