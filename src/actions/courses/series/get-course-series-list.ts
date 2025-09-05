"use server";

import prisma from "@/lib/prisma";
import { serializePrismaData } from "@/lib/serialize-prisma-data";

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

    // Serializar dados do Prisma
    const serializedSeries = serializePrismaData(series);

    return { success: true, data: serializedSeries };
  } catch (error) {
    console.error("Erro ao listar séries de cursos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
