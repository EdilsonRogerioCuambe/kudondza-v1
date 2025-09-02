"use server";

import prisma from "@/lib/prisma";

export async function getSeries() {
  try {
    const items = await prisma.courseSeries.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { courses: true } },
      },
    });
    return { success: true, data: items } as const;
  } catch (error) {
    console.error("Erro ao listar séries:", error);
    return { success: false, error: "Erro ao listar" } as const;
  }
}
