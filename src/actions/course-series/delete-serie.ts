"use server";

import prisma from "@/lib/prisma";

export async function deleteSerie(id: string) {
  try {
    await prisma.courseSeries.delete({ where: { id } });
    return { success: true } as const;
  } catch (error) {
    console.error("Erro ao excluir série:", error);
    return { success: false, error: "Erro ao excluir série" } as const;
  }
}
