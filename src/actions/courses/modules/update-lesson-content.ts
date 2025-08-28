"use server";

import prisma from "@/lib/prisma";

export async function updateLessonContent(lessonId: string, content: string) {
  if (!lessonId || !content) {
    return {
      success: false,
      error: "lessonId e content são obrigatórios",
    } as const;
  }

  try {
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { description: content },
      select: {
        id: true,
        description: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: updatedLesson,
    } as const;
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error);
    return { success: false, error: "Erro ao atualizar conteúdo" } as const;
  }
}
