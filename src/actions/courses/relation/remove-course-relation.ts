"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Remove um relacionamento entre cursos
 */
export async function removeCourseRelation(id: string) {
  try {
    const relation = await prisma.courseRelation.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new Error("Relacionamento não encontrado");
    }

    await prisma.courseRelation.delete({
      where: { id },
    });

    revalidatePath(`/admin/courses/${relation.sourceCourseId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover relacionamento:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
