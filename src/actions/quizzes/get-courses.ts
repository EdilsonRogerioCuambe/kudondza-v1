"use server";

import prisma from "@/lib/prisma";

export interface CourseOption {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export async function getCourses() {
  try {
    console.log("Buscando cursos...");

    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
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
      orderBy: {
        title: "asc",
      },
    });

    console.log(`Encontrados ${courses.length} cursos`);

    return {
      success: true,
      data: courses,
    };
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);

    // Se for erro de Prisma, retornar mensagem mais específica
    if (error instanceof Error) {
      return {
        success: false,
        error: `Erro ao buscar cursos: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
