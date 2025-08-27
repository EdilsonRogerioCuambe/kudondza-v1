"use server";

import prisma from "@/lib/prisma";

export async function getSubcategory(identifier: string) {
  try {
    let subcategory = await prisma.subcategory.findUnique({
      where: { id: identifier },
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

    if (!subcategory) {
      subcategory = await prisma.subcategory.findUnique({
        where: { slug: identifier },
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
    }

    if (!subcategory) {
      return {
        success: false,
        error: "Subcategoria não encontrada",
      };
    }

    return {
      success: true,
      data: subcategory,
    };
  } catch (error) {
    console.error("Erro ao buscar subcategoria:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
