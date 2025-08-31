"use server";

import prisma from "@/lib/prisma";

export type CategoryWithCount = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
};

export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    // Buscar contagem de comunidades para cada categoria
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const communityCount = await prisma.community.count({
          where: { categoryId: category.id },
        });

        return {
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          count: communityCount,
        };
      })
    );

    // Ordenar por contagem decrescente
    return categoriesWithCount.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    // Retornar array vazio em caso de erro em vez de lançar exceção
    return [];
  }
}
