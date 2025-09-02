"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateBadgeSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().min(2, "Descrição obrigatória"),
  icon: z.string().min(1, "Ícone é obrigatório"),
  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/i, "Cor inválida (hex)"),
  rarity: z
    .enum(["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"])
    .default("COMMON"),
  xpReward: z.coerce.number().int().min(0).default(100),
  isActive: z.coerce.boolean().default(true),
  isLimited: z.coerce.boolean().default(false),
  expiresAt: z.string().datetime().nullable().optional(),
  criteria: z.string().optional(), // JSON string
});

export type CreateBadgeInput = z.infer<typeof CreateBadgeSchema>;

export async function createBadge(formData: FormData) {
  try {
    const raw: CreateBadgeInput = {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
      icon: String(formData.get("icon") || ""),
      color: String(formData.get("color") || "#3B82F6"),
      rarity: String(
        formData.get("rarity") || "COMMON"
      ) as CreateBadgeInput["rarity"],
      xpReward: Number(formData.get("xpReward") || 100),
      isActive: String(formData.get("isActive") || "true") === "true",
      isLimited: String(formData.get("isLimited") || "false") === "true",
      expiresAt: (formData.get("expiresAt") as string) || undefined,
      criteria: (formData.get("criteria") as string) || "",
    };

    const parsed = CreateBadgeSchema.parse(raw);

    const created = await prisma.badge.create({
      data: {
        name: parsed.name,
        description: parsed.description,
        icon: parsed.icon,
        color: parsed.color,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rarity: parsed.rarity as any,
        xpReward: parsed.xpReward,
        isActive: parsed.isActive,
        isLimited: parsed.isLimited,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        criteria:
          parsed.criteria && parsed.criteria.length > 0
            ? JSON.parse(parsed.criteria)
            : {},
      },
    });

    return { success: true, data: created } as const;
  } catch (error) {
    console.error("Erro ao criar badge:", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return { success: false, error: message } as const;
  }
}
