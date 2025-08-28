"use server";

import prisma from "@/lib/prisma";

export async function getLessonBySlug(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  if (!courseSlug || !moduleSlug || !lessonSlug) {
    return {
      success: false,
      error: "courseSlug, moduleSlug e lessonSlug são obrigatórios",
    } as const;
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true, title: true, slug: true },
    });
    if (!course)
      return { success: false, error: "Curso não encontrado" } as const;

    const moduleData = await prisma.module.findFirst({
      where: { courseId: course.id, slug: moduleSlug },
      select: { id: true, title: true, slug: true },
    });

    if (!moduleData)
      return { success: false, error: "Módulo não encontrado" } as const;

    const lesson = await prisma.lesson.findFirst({
      where: {
        moduleId: moduleData.id,
        slug: lessonSlug,
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        order: true,
        slug: true,
        videoId: true,
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
        resources: {
          select: {
            id: true,
            title: true,
            description: true,
            url: true,
            type: true,
          },
        },
      },
    });

    if (!lesson)
      return { success: false, error: "Lição não encontrada" } as const;

    return {
      success: true,
      data: {
        lesson,
        module: moduleData,
        course: { id: course.id, title: course.title, slug: course.slug },
      },
    } as const;
  } catch (error) {
    console.error("Erro ao obter lição:", error);
    return { success: false, error: "Erro ao obter lição" } as const;
  }
}
