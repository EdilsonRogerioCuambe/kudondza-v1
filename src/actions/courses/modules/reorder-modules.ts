"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reorderModules(
  courseId: string,
  orderedModuleIds: string[]
) {
  if (!courseId) {
    return { success: false, error: "courseId é obrigatório" } as const;
  }
  if (!Array.isArray(orderedModuleIds) || orderedModuleIds.length === 0) {
    return { success: false, error: "Lista de módulos inválida" } as const;
  }

  try {
    // FASE 1: atribuir ordens temporárias altas para evitar colisão de unique (courseId, order)
    const tempBase = 1000;
    await prisma.$transaction(
      orderedModuleIds.map((moduleId, index) =>
        prisma.module.update({
          where: { id: moduleId, courseId },
          data: { order: tempBase + index + 1 },
        })
      )
    );

    // FASE 2: aplicar as ordens finais normalizadas
    await prisma.$transaction(
      orderedModuleIds.map((moduleId, index) =>
        prisma.module.update({
          where: { id: moduleId, courseId },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/admin/dashboard/courses");
    return { success: true } as const;
  } catch (error) {
    console.error("Erro ao reordenar módulos:", error);
    return { success: false, error: "Erro ao reordenar módulos" } as const;
  }
}
