"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UpdateSubcategorySchema } from "@/lib/zod-schema";
import prisma from "@/lib/prisma";

export async function updateSubcategory(
  data: z.infer<typeof UpdateSubcategorySchema>
) {
  try {
    const validatedData = UpdateSubcategorySchema.parse(data);

    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingSubcategory) {
      return {
        success: false,
        error: "Subcategoria não encontrada",
      };
    }

    if (validatedData.slug && validatedData.slug !== existingSubcategory.slug) {
      const slugExists = await prisma.subcategory.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return {
          success: false,
          error: "Já existe uma subcategoria com este slug",
        };
      }
    }

    const subcategory = await prisma.subcategory.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        icon: validatedData.icon,
        color: validatedData.color,
        isActive: validatedData.isActive,
        sortOrder: validatedData.sortOrder,
        categoryId: validatedData.categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/admin/dashboard/courses");

    return {
      success: true,
      data: subcategory,
    };
  } catch (error) {
    console.error("Erro ao atualizar subcategoria:", error);

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
