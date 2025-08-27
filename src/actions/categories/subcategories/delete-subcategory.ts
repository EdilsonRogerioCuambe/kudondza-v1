"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSubcategory(id: string) {
  try {
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!existingSubcategory) {
      return {
        success: false,
        error: "Subcategoria não encontrada",
      };
    }

    if (existingSubcategory._count.courses > 0) {
      return {
        success: false,
        error:
          "Não é possível deletar uma subcategoria que possui cursos associados",
      };
    }

    await prisma.subcategory.delete({ where: { id } });

    revalidatePath("/admin/dashboard/categories");
    revalidatePath("/admin/dashboard/courses");

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    console.error("Erro ao deletar subcategoria:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
