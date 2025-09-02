"use server";

import prisma from "@/lib/prisma";

export async function getLevelReward(id: string) {
  try {
    const item = await prisma.levelReward.findUnique({ where: { id } });
    if (!item)
      return { success: false, error: "Recompensa não encontrada" } as const;
    return { success: true, data: item } as const;
  } catch (error) {
    console.error("Erro ao buscar recompensa:", error);
    return { success: false, error: "Erro ao buscar" } as const;
  }
}
