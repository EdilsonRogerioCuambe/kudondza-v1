"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export type FeaturedCourse = {
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

export async function getFeaturedCourses(limit = 8): Promise<FeaturedCourse[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        // isFeatured: true,
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
      orderBy: [{ featuredAt: "desc" }, { viewCount: "desc" }],
      take: limit,
    });

    // Se não há sessão, retornar apenas os dados básicos
    if (!session?.user?.id) {
      return courses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        thumbnail: c.thumbnail,
        level: c.level,
        language: c.language,
        shortDescription: c.shortDescription,
        price: Number(c.price ?? 0),
        originalPrice:
          c.originalPrice !== null && c.originalPrice !== undefined
            ? Number(c.originalPrice)
            : null,
        currency: c.currency,
        duration: c.duration ?? null,
        instructorName: c.instructor?.name ?? null,
        categoryName: c.category?.name ?? null,
        averageRating:
          c.reviews && c.reviews.length
            ? c.reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              c.reviews.length
            : null,
        ratingsCount: c.reviews?.length ?? 0,
        enrollmentsCount: c._count?.enrollments ?? 0,
      }));
    }

    const userId = session.user.id;
    const courseIds = courses.map((c) => c.id);

    // Buscar assinaturas ativas do usuário para estes cursos específicos
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
        cancelAtPeriodEnd: false,
        OR: courseIds.map((courseId) => ({
          metadata: {
            path: ["courseId"],
            equals: courseId,
          },
        })),
      },
      select: {
        id: true,
        status: true,
        currentPeriodEnd: true,
        trialEnd: true,
        createdAt: true,
        cancelAtPeriodEnd: true,
        metadata: true,
      },
    });

    // Criar mapa de assinaturas por curso
    const subscriptionMap = new Map();

    subscriptions.forEach((subscription) => {
      if (
        subscription.metadata &&
        typeof subscription.metadata === "object" &&
        "courseId" in subscription.metadata
      ) {
        const courseId = subscription.metadata.courseId as string;
        subscriptionMap.set(courseId, {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          trialEnd: subscription.trialEnd,
          createdAt: subscription.createdAt,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        });
      }
    });

    return courses.map((c) => {
      const subscription = subscriptionMap.get(c.id);
      const hasActiveSubscription =
        !!subscription && subscription.cancelAtPeriodEnd !== true;
      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        thumbnail: c.thumbnail,
        level: c.level,
        language: c.language,
        shortDescription: c.shortDescription,
        price: Number(c.price ?? 0),
        originalPrice:
          c.originalPrice !== null && c.originalPrice !== undefined
            ? Number(c.originalPrice)
            : null,
        currency: c.currency,
        duration: c.duration ?? null,
        instructorName: c.instructor?.name ?? null,
        categoryName: c.category?.name ?? null,
        averageRating:
          c.reviews && c.reviews.length
            ? c.reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              c.reviews.length
            : null,
        ratingsCount: c.reviews?.length ?? 0,
        enrollmentsCount: c._count?.enrollments ?? 0,
        // Dados do usuário
        isEnrolled: hasActiveSubscription,
        enrollmentProgress: hasActiveSubscription ? 0 : 0, // TODO: Implementar progresso real
        enrollmentStatus: subscription?.status ?? null,
        completedAt: null, // TODO: Implementar data de conclusão
      };
    });
  } catch (error) {
    console.error("Erro ao buscar cursos em destaque:", error);
    return [];
  }
}
