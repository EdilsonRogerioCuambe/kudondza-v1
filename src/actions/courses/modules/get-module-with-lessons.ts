"use server";

import prisma from "@/lib/prisma";

export async function getModuleWithLessonsBySlugs(
  courseSlug: string,
  moduleSlug: string
) {
  if (!courseSlug || !moduleSlug) {
    return {
      success: false,
      error: "courseSlug e moduleSlug são obrigatórios",
    } as const;
  }
  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });
    if (!course)
      return { success: false, error: "Curso não encontrado" } as const;

    const moduleData = await prisma.module.findFirst({
      where: { courseId: course.id, slug: moduleSlug },
      select: {
        id: true,
        title: true,
        slug: true,
        order: true,
        description: true,
        isRequired: true,
        isPublic: true,
        unlockCriteria: true,
        xpReward: true,
        courseId: true,
        lessons: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            order: true,
            isPreview: true,
            isPublic: true,
            slug: true,
          },
        },
      },
    });
    if (!module)
      return { success: false, error: "Módulo não encontrado" } as const;

    return { success: true, data: moduleData } as const;
  } catch (error) {
    console.error("Erro ao obter módulo:", error);
    return { success: false, error: "Erro ao obter módulo" } as const;
  }
}
