"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateCourseInput, CreateCourseSchema } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Cria um novo curso
 */
export async function createCourse(data: CreateCourseInput) {
  try {
    // Garantir sessão para obter o instrutor
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      throw new Error("Não autenticado");
    }

    // Validar dados de entrada
    const validatedData = CreateCourseSchema.parse(data);

    // Verificar se o slug já existe
    const existingCourse = await prisma.course.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCourse) {
      throw new Error("Já existe um curso com este slug");
    }

    // Criar o curso
    const { seriesId, subcategoryId, duration, originalPrice, ...rest } =
      validatedData;
    const course = await prisma.course.create({
      data: {
        ...rest,
        // Sempre usar o usuário autenticado como instrutor por padrão
        instructorId: session.user.id,
        ...(seriesId ? { seriesId } : {}),
        ...(subcategoryId ? { subcategoryId } : {}),
        ...(duration ? { duration } : {}),
        ...(originalPrice ? { originalPrice } : {}),
        tags: validatedData.tags || [],
        seoKeywords: validatedData.seoKeywords || [],
        unlockCriteria: validatedData.unlockCriteria || undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
            reviews: true,
            certificates: true,
          },
        },
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, data: course };
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
