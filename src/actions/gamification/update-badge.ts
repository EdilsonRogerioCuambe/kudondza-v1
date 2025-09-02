"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateBadgeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  icon: z.string().min(1).optional(),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/i, "Cor inválida (hex)")
    .optional(),
  rarity: z
    .enum(["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"])
    .optional(),
  xpReward: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
  isLimited: z.coerce.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  criteria: z.string().optional(),
});

export type UpdateBadgeInput = z.infer<typeof UpdateBadgeSchema>;

export async function updateBadge(formData: FormData) {
  try {
    const raw: UpdateBadgeInput = {
      id: String(formData.get("id") || ""),
      name: (formData.get("name") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      icon: (formData.get("icon") as string) || undefined,
      color: (formData.get("color") as string) || undefined,
      rarity:
        (formData.get("rarity") as UpdateBadgeInput["rarity"]) || undefined,
      xpReward: formData.get("xpReward")
        ? Number(formData.get("xpReward"))
        : undefined,
      isActive: formData.get("isActive")
        ? String(formData.get("isActive")) === "true"
        : undefined,
      isLimited: formData.get("isLimited")
        ? String(formData.get("isLimited")) === "true"
        : undefined,
      expiresAt: (formData.get("expiresAt") as string) || undefined,
      criteria: (formData.get("criteria") as string) || undefined,
    };

    const parsed = UpdateBadgeSchema.parse(raw);

    const updated = await prisma.badge.update({
      where: { id: parsed.id },
      data: {
        ...(parsed.name && { name: parsed.name }),
        ...(parsed.description && { description: parsed.description }),
        ...(parsed.icon && { icon: parsed.icon }),
        ...(parsed.color && { color: parsed.color }),
        ...(parsed.rarity && { rarity: parsed.rarity }),
        ...(parsed.xpReward !== undefined && { xpReward: parsed.xpReward }),
        ...(parsed.isActive !== undefined && { isActive: parsed.isActive }),
        ...(parsed.isLimited !== undefined && { isLimited: parsed.isLimited }),
        ...(parsed.expiresAt !== undefined && {
          expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        }),
        ...(parsed.criteria !== undefined && {
          criteria:
            parsed.criteria && parsed.criteria.length > 0
              ? JSON.parse(parsed.criteria)
              : {},
        }),
      },
    });

    return { success: true, data: updated } as const;
  } catch (error) {
    console.error("Erro ao atualizar badge:", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return { success: false, error: message } as const;
  }
}
