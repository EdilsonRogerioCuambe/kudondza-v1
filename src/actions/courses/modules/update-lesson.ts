"use server";

import prisma from "@/lib/prisma";
import { CreateLessonInput } from "./create-lesson";

export async function updateLesson(
  lessonId: string,
  data: Partial<CreateLessonInput>
) {
  try {
    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: data.title,
        slug: data.slug || null,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        videoId: data.videoId || null,
        videoUrl: data.videoUrl || null,
        videoDuration: data.videoDuration || null,
        transcript: data.transcript || null,
        isPreview: data.isPreview,
        isRequired: data.isRequired,
        isPublic: data.isPublic,
        xpReward: data.xpReward,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDescription: true,
        videoId: true,
        videoUrl: true,
        videoDuration: true,
        transcript: true,
        isPreview: true,
        isRequired: true,
        isPublic: true,
        xpReward: true,
        updatedAt: true,
      },
    });
    return { success: true, data: updated } as const;
  } catch (error) {
    console.error("Erro ao atualizar aula:", error);
    return { success: false, error: "Erro ao atualizar aula" } as const;
  }
}
