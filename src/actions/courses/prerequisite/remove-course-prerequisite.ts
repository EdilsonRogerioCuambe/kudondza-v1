"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Remove um pré-requisito de um curso
 */
export async function removeCoursePrerequisite(id: string) {
  try {
    const prerequisite = await prisma.coursePrerequisite.findUnique({
      where: { id },
    });

    if (!prerequisite) {
      throw new Error("Pré-requisito não encontrado");
    }

    await prisma.coursePrerequisite.delete({
      where: { id },
    });

    revalidatePath(`/admin/courses/${prerequisite.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover pré-requisito:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
