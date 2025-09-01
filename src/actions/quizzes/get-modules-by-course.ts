"use server";

import prisma from "@/lib/prisma";

export interface ModuleOption {
  id: string;
  title: string;
  slug: string | null;
  order: number;
}

export async function getModulesByCourse(courseId: string) {
  try {
    console.log(`Buscando módulos para o curso: ${courseId}`);

    const modules = await prisma.module.findMany({
      where: {
        courseId,
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        order: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    console.log(
      `Encontrados ${modules.length} módulos para o curso ${courseId}`
    );

    return {
      success: true,
      data: modules,
    };
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);

    // Se for erro de Prisma, retornar mensagem mais específica
    if (error instanceof Error) {
      return {
        success: false,
        error: `Erro ao buscar módulos: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
