"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export async function deleteCategory(id: string) {
  try {
    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: true,
            children: true,
            subcategories: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return {
        success: false,
        error: "Categoria não encontrada",
      };
    }

    // Verificar se há cursos associados
    if (existingCategory._count.courses > 0) {
      return {
        success: false,
        error:
          "Não é possível deletar uma categoria que possui cursos associados",
      };
    }

    // Verificar se há subcategorias associadas
    if (existingCategory._count.subcategories > 0) {
      return {
        success: false,
        error:
          "Não é possível deletar uma categoria que possui subcategorias associadas",
      };
    }

    // Verificar se há categorias filhas
    if (existingCategory._count.children > 0) {
      return {
        success: false,
        error:
          "Não é possível deletar uma categoria que possui categorias filhas",
      };
    }

    // Deletar a categoria
    await prisma.category.delete({
      where: { id },
    });

    // Revalidar cache
    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/admin/dashboard/courses");

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
