"use server";

import prisma from "@/lib/prisma";

/**
 * Busca uma série de cursos
 */
export async function getCourseSeries(id: string) {
  try {
    const series = await prisma.courseSeries.findUnique({
      where: { id },
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
        courses: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
            price: true,
            status: true,
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!series) {
      return { success: false, error: "Série não encontrada" };
    }

    return { success: true, data: series };
  } catch (error) {
    console.error("Erro ao buscar série de cursos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
