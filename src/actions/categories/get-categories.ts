/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";
import { CategoryFiltersSchema } from "@/lib/zod-schema";

export async function getCategories(
  filters?: z.infer<typeof CategoryFiltersSchema>
) {
  try {
    // Validar filtros
    const validatedFilters = CategoryFiltersSchema.parse(filters || {});

    const {
      search,
      isActive,
      isFeatured,
      parentId,
      sortBy,
      sortOrder,
      page,
      limit,
    } = validatedFilters;

    // Construir where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (parentId !== undefined) {
      where.parentId = parentId;
    }

    // Construir orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Calcular offset
    const offset = (page - 1) * limit;

    // Buscar categorias
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
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
      }),
      prisma.category.count({ where }),
    ]);

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        categories,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Filtros inválidos: " + error.message,
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

// Função para buscar categorias hierárquicas (árvore)
export async function getCategoriesTree() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        children: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            subcategories: {
              where: { isActive: true },
              orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
          },
        },
        subcategories: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
    });

    // Filtrar apenas categorias raiz (sem parentId)
    const rootCategories = categories.filter((cat) => !cat.parentId);

    return {
      success: true,
      data: rootCategories,
    };
  } catch (error) {
    console.error("Erro ao buscar árvore de categorias:", error);

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
