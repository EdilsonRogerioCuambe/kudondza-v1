"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateSeriesSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  isSequential: z.coerce.boolean().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
  categoryId: z.string().optional(),
});

export async function updateSerie(formData: FormData) {
  try {
    const parsed = UpdateSeriesSchema.parse({
      id: formData.get("id"),
      title: formData.get("title") ?? undefined,
      description: formData.get("description") ?? undefined,
      thumbnail: formData.get("thumbnail") ?? undefined,
      isSequential: formData.get("isSequential") ?? undefined,
      level: formData.get("level") ?? undefined,
      categoryId: formData.get("categoryId") ?? undefined,
    });

    const updated = await prisma.courseSeries.update({
      where: { id: parsed.id },
      data: {
        ...(parsed.title && { title: parsed.title }),
        ...(parsed.description !== undefined && {
          description: parsed.description,
        }),
        ...(parsed.thumbnail !== undefined && { thumbnail: parsed.thumbnail }),
        ...(parsed.isSequential !== undefined && {
          isSequential: parsed.isSequential,
        }),
        ...(parsed.level && { level: parsed.level }),
        ...(parsed.categoryId && { categoryId: parsed.categoryId }),
      },
    });

    return { success: true, data: updated } as const;
  } catch (error) {
    console.error("Erro ao atualizar série:", error);
    return { success: false, error: "Erro ao atualizar série" } as const;
  }
}
