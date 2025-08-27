"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteLesson(lessonId: string, moduleId: string) {
  try {
    // Verificar se a aula existe
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId, moduleId },
      include: {
        _count: {
          select: {
            progress: true,
            analytics: true,
            activities: true,
            resources: true,
          },
        },
      },
    });

    if (!lesson) {
      return {
        success: false,
        error: "Aula não encontrada",
      };
    }

    // Verificar se há progresso associado
    if (lesson._count.progress > 0) {
      return {
        success: false,
        error:
          "Não é possível excluir uma aula que possui progresso de usuários",
      };
    }

    // Excluir a aula
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    // Reordenar as aulas restantes
    const remainingLessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
      select: { id: true },
    });

    // Atualizar a ordem das aulas restantes
    await prisma.$transaction(
      remainingLessons.map((lesson, index) =>
        prisma.lesson.update({
          where: { id: lesson.id },
          data: { order: index + 1 },
        })
      )
    );

    // Revalidar cache
    revalidatePath("/admin/dashboard/courses");
    revalidatePath(
      `/admin/dashboard/courses/[courseSlug]/modules/[moduleSlug]`
    );

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir aula:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
