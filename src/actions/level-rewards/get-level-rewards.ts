"use server";

import prisma from "@/lib/prisma";

export async function getLevelRewards() {
  try {
    const items = await prisma.levelReward.findMany({
      orderBy: [{ level: "asc" }],
    });
    return { success: true, data: items } as const;
  } catch (error) {
    console.error("Erro ao listar recompensas de nível:", error);
    return { success: false, error: "Erro ao listar" } as const;
  }
}
