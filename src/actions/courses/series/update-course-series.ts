"use server";

import prisma from "@/lib/prisma";
import {
  UpdateCourseSeriesInput,
  UpdateCourseSeriesSchema,
} from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

/**
 * Atualiza uma série de cursos
 */
export async function updateCourseSeries(data: UpdateCourseSeriesInput) {
  try {
    const validatedData = UpdateCourseSeriesSchema.parse(data);

    const series = await prisma.courseSeries.update({
      where: { id: validatedData.id },
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
    revalidatePath(`/admin/courses/series/${series.id}`);
    return { success: true, data: series };
  } catch (error) {
    console.error("Erro ao atualizar série de cursos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
