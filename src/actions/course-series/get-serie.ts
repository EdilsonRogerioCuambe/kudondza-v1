"use server";

import prisma from "@/lib/prisma";

export async function getSerie(id: string) {
  try {
    const item = await prisma.courseSeries.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        courses: { select: { id: true, title: true, slug: true } },
      },
    });
    if (!item)
      return { success: false, error: "Série não encontrada" } as const;
    return { success: true, data: item } as const;
  } catch (error) {
    console.error("Erro ao buscar série:", error);
    return { success: false, error: "Erro ao buscar" } as const;
  }
}
