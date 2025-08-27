"use server";

import prisma from "@/lib/prisma";

export interface AvailableCourse {
  id: string;
  title: string;
  slug: string;
  level: string;
  language: string;
}

export async function getAvailableCourses(excludeCourseId?: string) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(excludeCourseId && { id: { not: excludeCourseId } }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        level: true,
        language: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return { success: true, data: courses } as const;
  } catch (error) {
    console.error("Erro ao buscar cursos disponíveis:", error);
    return { success: false, error: "Erro ao buscar cursos" } as const;
  }
}
