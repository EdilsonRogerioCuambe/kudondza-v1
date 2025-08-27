"use server";

import prisma from "@/lib/prisma";
import {
  CreateCourseSeriesInput,
  CreateCourseSeriesSchema,
} from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

/**
 * Cria uma nova série de cursos
 */
export async function createCourseSeries(data: CreateCourseSeriesInput) {
  try {
    const validatedData = CreateCourseSeriesSchema.parse(data);

    const series = await prisma.courseSeries.create({
      data: validatedData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    revalidatePath("/admin/courses");
    return { success: true, data: series };
  } catch (error) {
    console.error("Erro ao criar série de cursos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
