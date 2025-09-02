"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateLevelRewardSchema = z.object({
  id: z.string().min(1),
  level: z.coerce.number().int().min(1).optional(),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  type: z
    .enum([
      "BADGE",
      "TITLE",
      "XP_BONUS",
      "FEATURE_UNLOCK",
      "CUSTOM_AVATAR",
      "CERTIFICATE",
    ])
    .optional(),
  value: z.string().optional(),
  xpReward: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});

export async function updateLevelReward(formData: FormData) {
  try {
    const parsed = UpdateLevelRewardSchema.parse({
      id: formData.get("id"),
      level: formData.get("level") ?? undefined,
      title: formData.get("title") ?? undefined,
      description: formData.get("description") ?? undefined,
      type: formData.get("type") ?? undefined,
      value: formData.get("value") ?? undefined,
      xpReward: formData.get("xpReward") ?? undefined,
      isActive: formData.get("isActive") ?? undefined,
    });

    const updated = await prisma.levelReward.update({
      where: { id: parsed.id },
      data: {
        ...(parsed.level !== undefined && { level: parsed.level }),
        ...(parsed.title && { title: parsed.title }),
        ...(parsed.description !== undefined && {
          description: parsed.description,
        }),
        ...(parsed.type && { type: parsed.type }),
        ...(parsed.value !== undefined && { value: parsed.value }),
        ...(parsed.xpReward !== undefined && { xpReward: parsed.xpReward }),
        ...(parsed.isActive !== undefined && { isActive: parsed.isActive }),
      },
    });

    return { success: true, data: updated } as const;
  } catch (error) {
    console.error("Erro ao atualizar recompensa:", error);
    return { success: false, error: "Erro ao atualizar" } as const;
  }
}
