/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";

export async function getSubcategories(categoryId?: string) {
  try {
    const where: any = {};

    if (categoryId) {
      // Trazer subcategorias diretamente da categoria selecionada
      // ou de categorias-filhas cujo parentId seja a categoria selecionada
      where.OR = [{ categoryId }, { category: { parentId: categoryId } }];
    }

    const subcategories = await prisma.subcategory.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
      },
    });

    return {
      success: true,
      data: subcategories,
    };
  } catch (error) {
    console.error("Erro ao buscar subcategorias:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
