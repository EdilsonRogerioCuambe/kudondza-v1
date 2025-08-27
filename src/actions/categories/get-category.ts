"use server";

import prisma from "@/lib/prisma";

export async function getCategory(identifier: string) {
  try {
    // Tentar buscar por ID primeiro
    let category = await prisma.category.findUnique({
      where: { id: identifier },
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
        _count: {
          select: {
            courses: true,
            children: true,
            subcategories: true,
          },
        },
      },
    });

    // Se não encontrou por ID, tentar por slug
    if (!category) {
      category = await prisma.category.findUnique({
        where: { slug: identifier },
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
          _count: {
            select: {
              courses: true,
              children: true,
              subcategories: true,
            },
          },
        },
      });
    }

    if (!category) {
      return {
        success: false,
        error: "Categoria não encontrada",
      };
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
