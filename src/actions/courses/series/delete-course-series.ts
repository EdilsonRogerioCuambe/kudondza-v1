"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Exclui uma série de cursos
 */
export async function deleteCourseSeries(id: string) {
  try {
    const series = await prisma.courseSeries.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!series) {
      throw new Error("Série não encontrada");
    }

    if (series._count.courses > 0) {
      throw new Error("Não é possível excluir uma série que possui cursos");
    }

    await prisma.courseSeries.delete({
      where: { id },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir série de cursos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
