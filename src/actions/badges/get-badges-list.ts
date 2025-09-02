"use server";

import prisma from "@/lib/prisma";

export async function getBadgesList() {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: [{ rarity: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: badges } as const;
  } catch (error) {
    console.error("Erro ao listar badges:", error);
    return { success: false, error: "Erro ao listar badges" } as const;
  }
}
