"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Exclui um curso
 */
export async function deleteCourse(id: string) {
  try {
    // Verificar se o curso existe
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    // Verificar se há matrículas ativas
    if (course._count.enrollments > 0) {
      throw new Error(
        "Não é possível excluir um curso que possui matrículas ativas"
      );
    }

    // Excluir o curso
    await prisma.course.delete({
      where: { id },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
