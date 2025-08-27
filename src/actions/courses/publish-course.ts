"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Publica um curso
 */
export async function publishCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    if (course.status === "PUBLISHED") {
      throw new Error("Curso já está publicado");
    }

    // Verificar se o curso tem pelo menos um módulo com uma aula
    const hasContent = course.modules.some(
      (module) => module.lessons.length > 0
    );
    if (!hasContent) {
      throw new Error("Curso deve ter pelo menos uma aula para ser publicado");
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      include: {
        category: {
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
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${course.slug}`);
    return { success: true, data: updatedCourse };
  } catch (error) {
    console.error("Erro ao publicar curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
