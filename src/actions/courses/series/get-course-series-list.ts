"use server";

import prisma from "@/lib/prisma";

/**
 * Lista séries de cursos
 */
export async function getCourseSeriesList(creatorId?: string) {
  try {
    const where = creatorId ? { creatorId } : {};

    const series = await prisma.courseSeries.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: series };
  } catch (error) {
    console.error("Erro ao listar séries de cursos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
