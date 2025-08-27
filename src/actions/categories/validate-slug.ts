"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";
import { ValidateCategorySlugSchema } from "@/lib/zod-schema";

export async function validateCategorySlug(data: z.infer<typeof ValidateCategorySlugSchema>) {
  try {
    // Validar dados de entrada
    const validatedData = ValidateCategorySlugSchema.parse(data);

    // Buscar categoria com o slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
      select: { id: true, name: true },
    });

    // Se encontrou uma categoria e não é a mesma que está sendo editada
    if (existingCategory && existingCategory.id !== validatedData.excludeId) {
      return {
        success: false,
        data: {
          isAvailable: false,
          existingCategory: {
            id: existingCategory.id,
            name: existingCategory.name,
          },
        },
      };
    }

    return {
      success: true,
      data: {
        isAvailable: true,
        existingCategory: null,
      },
    };
  } catch (error) {
    console.error("Erro ao validar slug da categoria:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Dados inválidos: " + error.message,
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
