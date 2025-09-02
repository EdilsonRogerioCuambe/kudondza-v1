"use server";

import prisma from "@/lib/prisma";

export async function toggleBadgeActive(id: string) {
  try {
    const current = await prisma.badge.findUnique({
      where: { id },
      select: { isActive: true },
    });
    if (!current)
      return { success: false, error: "Badge não encontrada" } as const;
    const updated = await prisma.badge.update({
      where: { id },
      data: { isActive: !current.isActive },
    });
    return { success: true, data: updated } as const;
  } catch (error) {
    console.error("Erro ao alternar status da badge:", error);
    return { success: false, error: "Erro ao alternar status" } as const;
  }
}
