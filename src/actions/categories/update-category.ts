"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { UpdateCategorySchema } from "@/lib/zod-schema";

export async function updateCategory(
  data: z.infer<typeof UpdateCategorySchema>
) {
  try {
    // Validar dados de entrada
    const validatedData = UpdateCategorySchema.parse(data);

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingCategory) {
      return {
        success: false,
        error: "Categoria não encontrada",
      };
    }

    // Verificar se o slug já existe (se foi alterado)
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return {
          success: false,
          error: "Já existe uma categoria com este slug",
        };
      }
    }

    // Verificar se a categoria pai existe (se fornecida)
    if (validatedData.parentId) {
      // Não permitir que uma categoria seja pai de si mesma
      if (validatedData.parentId === validatedData.id) {
        return {
          success: false,
          error: "Uma categoria não pode ser pai de si mesma",
        };
      }

      const parentCategory = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentCategory) {
        return {
          success: false,
          error: "Categoria pai não encontrada",
        };
      }

      // Verificar se não está criando um loop hierárquico
      const isDescendant = await checkIfDescendant(
        validatedData.id,
        validatedData.parentId
      );
      if (isDescendant) {
        return {
          success: false,
          error: "Não é possível definir uma categoria filha como pai",
        };
      }
    }

    // Atualizar a categoria
    const category = await prisma.category.update({
      where: { id: validatedData.id },
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
        seoKeywords: validatedData.seoKeywords,
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
    console.error("Erro ao atualizar categoria:", error);

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

// Função auxiliar para verificar se uma categoria é descendente de outra
async function checkIfDescendant(
  categoryId: string,
  potentialParentId: string
): Promise<boolean> {
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  });

  for (const child of children) {
    if (child.id === potentialParentId) {
      return true;
    }

    const isDescendant = await checkIfDescendant(child.id, potentialParentId);
    if (isDescendant) {
      return true;
    }
  }

  return false;
}
