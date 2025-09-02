"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateLevelRewardSchema = z.object({
  level: z.coerce.number().int().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum([
    "BADGE",
    "TITLE",
    "XP_BONUS",
    "FEATURE_UNLOCK",
    "CUSTOM_AVATAR",
    "CERTIFICATE",
  ]),
  value: z.string().min(1),
  xpReward: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

export async function createLevelReward(formData: FormData) {
  try {
    const parsed = CreateLevelRewardSchema.parse({
      level: formData.get("level"),
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      type: formData.get("type"),
      value: formData.get("value"),
      xpReward: formData.get("xpReward") ?? 0,
      isActive: formData.get("isActive") ?? "true",
    });

    const created = await prisma.levelReward.create({
      data: {
        level: parsed.level,
        title: parsed.title,
        description: parsed.description ?? null,
        type: parsed.type,
        value: parsed.value,
        xpReward: parsed.xpReward,
        isActive: parsed.isActive,
      },
    });

    return { success: true, data: created } as const;
  } catch (error) {
    console.error("Erro ao criar recompensa de nível:", error);
    return { success: false, error: "Erro ao criar recompensa" } as const;
  }
}
