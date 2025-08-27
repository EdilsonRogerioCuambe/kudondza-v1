"use server";

import prisma from "@/lib/prisma";
import { ValidateSlugSchema } from "@/lib/zod-schema";

/**
 * Valida se um slug é único
 */
export async function validateSlug(slug: string, excludeId?: string) {
  try {
    const validatedData = ValidateSlugSchema.parse({ slug, excludeId });

    const where: { slug: string; NOT?: { id: string } } = {
      slug: validatedData.slug,
    };
    if (validatedData.excludeId) {
      where.NOT = { id: validatedData.excludeId };
    }

    const existingCourse = await prisma.course.findFirst({ where });

    return { success: true, data: { isAvailable: !existingCourse } };
  } catch (error) {
    console.error("Erro ao validar slug:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
