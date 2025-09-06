"use server";

import prisma from "@/lib/prisma";

export async function getLessonBySlug(lessonSlug: string) {
  if (!lessonSlug) {
    return {
      success: false,
      error: "lessonSlug é obrigatório",
    } as const;
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        order: true,
        slug: true,
        videoUrl: true,
        videoDuration: true,
        transcript: true,
        isPreview: true,
        isRequired: true,
        isPublic: true,
        unlockCriteria: true,
        xpReward: true,
        moduleId: true,
        createdAt: true,
        updatedAt: true,
        module: {
          select: {
            id: true,
            title: true,
            slug: true,
            courseId: true,
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        resources: {
          select: {
            id: true,
            title: true,
            description: true,
            url: true,
            type: true,
            fileSize: true,
            mimeType: true,
            downloadable: true,
            createdAt: true,
          },
        },
      },
    });

    if (!lesson) {
      return { success: false, error: "Lição não encontrada" } as const;
    }

    return {
      success: true,
      data: lesson,
    } as const;
  } catch (error) {
    console.error("Erro ao obter lição:", error);
    return { success: false, error: "Erro ao obter lição" } as const;
  }
}
