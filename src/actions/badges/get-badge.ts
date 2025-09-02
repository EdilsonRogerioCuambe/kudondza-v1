"use server";

import prisma from "@/lib/prisma";

export async function getBadge(id: string) {
  try {
    const badge = await prisma.badge.findUnique({ where: { id } });
    if (!badge)
      return { success: false, error: "Badge não encontrada" } as const;
    return { success: true, data: badge } as const;
  } catch (error) {
    console.error("Erro ao buscar badge:", error);
    return { success: false, error: "Erro ao buscar badge" } as const;
  }
}
