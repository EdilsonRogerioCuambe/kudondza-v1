"use server";

import prisma from "@/lib/prisma";
import { serializePrismaData } from "@/lib/serialize-prisma-data";

export async function getModulesWithLessonsByCourseId(courseId: string) {
  if (!courseId) {
    return { success: false, error: "courseId é obrigatório" } as const;
  }
  try {
    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        order: true,
        description: true,
        isPublic: true,
        isRequired: true,
        lessons: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
            isPreview: true,
            isPublic: true,
          },
        },
        _count: {
          select: { lessons: true },
        },
      },
    });

    // Serializar dados do Prisma
    const serializedModules = serializePrismaData(modules);

    return { success: true, data: serializedModules } as const;
  } catch (error) {
    console.error("Erro ao obter módulos com aulas:", error);
    return {
      success: false,
      error: "Erro ao obter módulos com aulas",
    } as const;
  }
}
