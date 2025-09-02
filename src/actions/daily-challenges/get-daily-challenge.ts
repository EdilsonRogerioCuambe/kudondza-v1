"use server";

import prisma from "@/lib/prisma";

export async function getDailyChallenge(id: string) {
  try {
    const item = await prisma.dailyChallenge.findUnique({ where: { id } });
    if (!item)
      return { success: false, error: "Desafio não encontrado" } as const;
    return { success: true, data: item } as const;
  } catch (error) {
    console.error("Erro ao buscar desafio diário:", error);
    return { success: false, error: "Erro ao buscar" } as const;
  }
}
