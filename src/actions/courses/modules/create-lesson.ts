"use server";

import prisma from "@/lib/prisma";

export interface CreateLessonInput {
  moduleId: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  isPreview?: boolean;
  isPublic?: boolean;
  xpReward?: number;
}

export async function createLesson(data: CreateLessonInput) {
  try {
    const last = await prisma.lesson.findFirst({
      where: { moduleId: data.moduleId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (last?.order ?? 0) + 1;
    const created = await prisma.lesson.create({
      data: {
        moduleId: data.moduleId,
        title: data.title,
        slug: data.slug || null,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        isPreview: data.isPreview ?? false,
        isPublic: data.isPublic ?? false,
        xpReward: data.xpReward ?? 50,
        order: nextOrder,
      },
      select: { id: true },
    });
    return { success: true, data: created } as const;
  } catch (error) {
    console.error("Erro ao criar aula:", error);
    return { success: false, error: "Erro ao criar aula" } as const;
  }
}
