"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { CreateSubcategorySchema } from "@/lib/zod-schema";
import prisma from "@/lib/prisma";

export async function createSubcategory(
  data: z.infer<typeof CreateSubcategorySchema>
) {
  try {
    // Validar dados de entrada
    const validatedData = CreateSubcategorySchema.parse(data);

    // Verificar se o slug já existe
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSubcategory) {
      return {
        success: false,
        error: "Já existe uma subcategoria com este slug",
      };
    }

    // Verificar se a categoria pai existe
    const parentCategory = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!parentCategory) {
      return {
        success: false,
        error: "Categoria pai não encontrada",
      };
    }

    // Criar a subcategoria
    const subcategory = await prisma.subcategory.create({
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

    // Revalidar cache
    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/admin/dashboard/courses");

    return {
      success: true,
      data: subcategory,
    };
  } catch (error) {
    console.error("Erro ao criar subcategoria:", error);

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
