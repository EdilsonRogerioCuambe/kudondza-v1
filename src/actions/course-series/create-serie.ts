"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";

const CreateSeriesSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  isSequential: z.coerce.boolean().default(true),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  categoryId: z.string().min(1),
});

export async function createSerie(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" } as const;
    }
    const parsed = CreateSeriesSchema.parse({
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      thumbnail: formData.get("thumbnail") || undefined,
      isSequential: formData.get("isSequential") ?? "true",
      level: formData.get("level"),
      categoryId: formData.get("categoryId"),
    });

    const created = await prisma.courseSeries.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        thumbnail: parsed.thumbnail ?? null,
        isSequential: parsed.isSequential,
        level: parsed.level,
        category: { connect: { id: parsed.categoryId } },
        creator: { connect: { id: session.user.id } },
      },
    });

    return { success: true, data: created } as const;
  } catch (error) {
    console.error("Erro ao criar série:", error);
    return { success: false, error: "Erro ao criar série" } as const;
  }
}
