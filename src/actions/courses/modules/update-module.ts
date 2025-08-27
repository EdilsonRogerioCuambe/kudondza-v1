"use server";

import prisma from "@/lib/prisma";

export interface UpdateModuleInput {
  id: string;
  title?: string;
  slug?: string | null;
  description?: string | null;
  isRequired?: boolean;
  isPublic?: boolean;
  unlockCriteria?: unknown | null;
  xpReward?: number;
}

export async function updateModule(data: UpdateModuleInput) {
  try {
    const { id, ...rest } = data;
    const updated = await prisma.module.update({
      where: { id },
      data: {
        ...(rest.title !== undefined ? { title: rest.title } : {}),
        ...(rest.slug !== undefined ? { slug: rest.slug || null } : {}),
        ...(rest.description !== undefined
          ? { description: rest.description || null }
          : {}),
        ...(rest.isRequired !== undefined
          ? { isRequired: rest.isRequired }
          : {}),
        ...(rest.isPublic !== undefined ? { isPublic: rest.isPublic } : {}),
        ...(rest.unlockCriteria !== undefined
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? { unlockCriteria: (rest.unlockCriteria as any) ?? null }
          : {}),
        ...(rest.xpReward !== undefined ? { xpReward: rest.xpReward } : {}),
      },
      select: { id: true },
    });
    return { success: true, data: updated } as const;
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    return { success: false, error: "Erro ao atualizar módulo" } as const;
  }
}
