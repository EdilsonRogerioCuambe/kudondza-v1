"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { CreateCategorySchema } from "@/lib/zod-schema";

export async function createCategory(
  data: z.infer<typeof CreateCategorySchema>
) {
  try {
    // Validar dados de entrada
    const validatedData = CreateCategorySchema.parse(data);

    // Verificar se o slug já existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCategory) {
      return {
        success: false,
        error: "Já existe uma categoria com este slug",
      };
    }

    // Verificar se a categoria pai existe (se fornecida)
    if (validatedData.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentCategory) {
        return {
          success: false,
          error: "Categoria pai não encontrada",
        };
      }
    }

    // Criar a categoria
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        icon: validatedData.icon,
        color: validatedData.color,
        image: validatedData.image,
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
        sortOrder: validatedData.sortOrder,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
        seoKeywords: validatedData.seoKeywords || [],
        parentId: validatedData.parentId,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            courseCount: true,
          },
        },
      },
    });

    // Revalidar cache
    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/admin/dashboard/courses");

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);

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
