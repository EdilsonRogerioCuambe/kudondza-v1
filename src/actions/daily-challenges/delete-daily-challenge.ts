"use server";

import prisma from "@/lib/prisma";

export async function deleteDailyChallenge(id: string) {
  try {
    await prisma.dailyChallenge.delete({ where: { id } });
    return { success: true } as const;
  } catch (error) {
    console.error("Erro ao excluir desafio diário:", error);
    return { success: false, error: "Erro ao excluir" } as const;
  }
}
