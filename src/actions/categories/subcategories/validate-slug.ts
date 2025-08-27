"use server";

import prisma from "@/lib/prisma";
import { ValidateSubcategorySlugSchema } from "@/lib/zod-schema";
import { z } from "zod";

export async function validateSubcategorySlug(
  data: z.infer<typeof ValidateSubcategorySlugSchema>
) {
  try {
    const validatedData = ValidateSubcategorySlugSchema.parse(data);

    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { slug: validatedData.slug },
      select: { id: true, name: true },
    });

    if (
      existingSubcategory &&
      existingSubcategory.id !== validatedData.excludeId
    ) {
      return {
        success: false,
        data: {
          isAvailable: false,
          existingSubcategory: {
            id: existingSubcategory.id,
            name: existingSubcategory.name,
          },
        },
      };
    }

    return {
      success: true,
      data: {
        isAvailable: true,
        existingSubcategory: null,
      },
    };
  } catch (error) {
    console.error("Erro ao validar slug da subcategoria:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Dados inválidos: " + error.message,
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
