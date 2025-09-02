"use server";

import prisma from "@/lib/prisma";

export async function getDailyChallenges() {
  try {
    const items = await prisma.dailyChallenge.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });
    return { success: true, data: items } as const;
  } catch (error) {
    console.error("Erro ao listar desafios diários:", error);
    return { success: false, error: "Erro ao listar" } as const;
  }
}
