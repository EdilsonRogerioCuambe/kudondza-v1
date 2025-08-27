"use server";

import prisma from "@/lib/prisma";

export async function getModulesByCourseId(courseId: string) {
  if (!courseId) {
    return { success: false, error: "courseId é obrigatório" } as const;
  }
  try {
    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        order: true,
        isPublic: true,
        isRequired: true,
      },
    });
    return { success: true, data: modules } as const;
  } catch (error) {
    console.error("Erro ao obter módulos:", error);
    return { success: false, error: "Erro ao obter módulos" } as const;
  }
}
