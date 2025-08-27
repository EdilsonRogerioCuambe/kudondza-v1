"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reorderLessons(
  moduleId: string,
  orderedLessonIds: string[]
) {
  if (!moduleId)
    return { success: false, error: "moduleId é obrigatório" } as const;
  if (!Array.isArray(orderedLessonIds) || orderedLessonIds.length === 0)
    return { success: false, error: "Lista de aulas inválida" } as const;

  try {
    const tempBase = 1000;
    await prisma.$transaction(
      orderedLessonIds.map((lessonId, index) =>
        prisma.lesson.update({
          where: { id: lessonId, moduleId },
          data: { order: tempBase + index + 1 },
        })
      )
    );
    await prisma.$transaction(
      orderedLessonIds.map((lessonId, index) =>
        prisma.lesson.update({
          where: { id: lessonId, moduleId },
          data: { order: index + 1 },
        })
      )
    );
    revalidatePath("/admin/dashboard/courses");
    return { success: true } as const;
  } catch (error) {
    console.error("Erro ao reordenar aulas:", error);
    return { success: false, error: "Erro ao reordenar aulas" } as const;
  }
}
