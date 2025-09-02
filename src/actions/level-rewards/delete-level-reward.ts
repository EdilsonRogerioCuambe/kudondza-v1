"use server";

import prisma from "@/lib/prisma";

export async function deleteLevelReward(id: string) {
  try {
    await prisma.levelReward.delete({ where: { id } });
    return { success: true } as const;
  } catch (error) {
    console.error("Erro ao excluir recompensa:", error);
    return { success: false, error: "Erro ao excluir" } as const;
  }
}
