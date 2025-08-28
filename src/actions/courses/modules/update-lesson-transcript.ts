"use server";

import prisma from "@/lib/prisma";

export async function updateLessonTranscript(
  lessonId: string,
  transcript: string
) {
  if (!lessonId || !transcript) {
    return {
      success: false,
      error: "lessonId e transcript são obrigatórios",
    } as const;
  }

  try {
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { transcript },
      select: {
        id: true,
        transcript: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: updatedLesson,
    } as const;
  } catch (error) {
    console.error("Erro ao atualizar transcrição:", error);
    return { success: false, error: "Erro ao atualizar transcrição" } as const;
  }
}
