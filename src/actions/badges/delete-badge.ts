"use server";

import prisma from "@/lib/prisma";

export async function deleteBadge(id: string) {
  try {
    await prisma.badge.delete({ where: { id } });
    return { success: true } as const;
  } catch (error) {
    console.error("Erro ao excluir badge:", error);
    return { success: false, error: "Erro ao excluir badge" } as const;
  }
}
