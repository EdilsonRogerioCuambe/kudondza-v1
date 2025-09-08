"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export type CourseWithUserProgress = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  level: string;
  language: string;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  duration?: number | null;
  instructorName?: string | null;
  categoryName?: string | null;
  averageRating?: number | null;
  ratingsCount?: number;
  enrollmentsCount?: number;
  // Dados do usuário
  isEnrolled?: boolean;
  enrollmentProgress?: number;
  enrollmentStatus?: string;
  completedAt?: Date | null;
};

export async function getCoursesWithUserProgress(
  courseIds: string[]
): Promise<CourseWithUserProgress[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return [];
    }

    const userId = session.user.id;

    // Buscar cursos com dados básicos
    const courses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        level: true,
        language: true,
        shortDescription: true,
        price: true,
        originalPrice: true,
        currency: true,
        duration: true,
        instructor: { select: { name: true } },
        category: { select: { name: true } },
        reviews: { select: { rating: true } },
        _count: { select: { enrollments: true } },
      },
    });

    // Buscar matrículas do usuário para estes cursos
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        courseId: { in: courseIds },
      },
      select: {
        courseId: true,
        status: true,
        progress: true,
        completedAt: true,
      },
    });

    // Criar mapa de matrículas por curso
    const enrollmentMap = new Map(
      enrollments.map((enrollment) => [
        enrollment.courseId,
        {
          status: enrollment.status,
          progress: Number(enrollment.progress),
          completedAt: enrollment.completedAt,
        },
      ])
    );

    return courses.map((course) => {
      const enrollment = enrollmentMap.get(course.id);

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        level: course.level,
        language: course.language,
        shortDescription: course.shortDescription,
        price: Number(course.price ?? 0),
        originalPrice:
          course.originalPrice !== null && course.originalPrice !== undefined
            ? Number(course.originalPrice)
            : null,
        currency: course.currency,
        duration: course.duration ?? null,
        instructorName: course.instructor?.name ?? null,
        categoryName: course.category?.name ?? null,
        averageRating:
          course.reviews && course.reviews.length
            ? course.reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              course.reviews.length
            : null,
        ratingsCount: course.reviews?.length ?? 0,
        enrollmentsCount: course._count?.enrollments ?? 0,
        // Dados do usuário
        isEnrolled: !!enrollment,
        enrollmentProgress: enrollment?.progress ?? 0,
        enrollmentStatus: enrollment?.status ?? undefined,
        completedAt: enrollment?.completedAt ?? null,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar cursos com progresso do usuário:", error);
    return [];
  }
}
