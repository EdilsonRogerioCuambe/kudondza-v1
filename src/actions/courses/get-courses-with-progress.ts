"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializePrismaData } from "@/lib/serialize-prisma-data";
import { CourseFilters, CourseFiltersSchema } from "@/lib/zod-schema";
import { headers } from "next/headers";

/**
 * Lista cursos com filtros, paginação e dados de progresso do usuário
 */
export async function getCoursesWithProgress(
  filters: CourseFilters = { page: 1, limit: 20 }
) {
  try {
    // Validar filtros
    const validatedFilters = CourseFiltersSchema.parse(filters);

    const {
      search,
      categoryId,
      subcategoryId,
      level,
      status,
      isPublic,
      isPremium,
      instructorId,
      tags,
      minPrice,
      maxPrice,
      language,
      isFeatured,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = validatedFilters;

    // Construir where clause
    const where: {
      OR?: Array<{ [key: string]: unknown }>;
      categoryId?: string;
      subcategoryId?: string;
      level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
      status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | "SUSPENDED";
      isPublic?: boolean;
      isPremium?: boolean;
      instructorId?: string;
      tags?: { hasSome: string[] };
      language?: string;
      isFeatured?: boolean;
      price?: { gte?: number; lte?: number };
    } = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId;
    if (level) where.level = level;
    if (status) where.status = status;
    if (typeof isPublic === "boolean") where.isPublic = isPublic;
    if (typeof isPremium === "boolean") where.isPremium = isPremium;
    if (instructorId) where.instructorId = instructorId;
    if (tags && tags.length > 0) where.tags = { hasSome: tags };
    if (language) where.language = language;
    if (typeof isFeatured === "boolean") where.isFeatured = isFeatured;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Calcular offset
    const offset = (page - 1) * limit;

    // Buscar cursos
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
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
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Buscar dados de assinatura do usuário se estiver logado
    const subscriptionMap = new Map();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.id) {
      const courseIds = courses.map((c) => c.id);
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId: session.user.id,
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
    }

    const serializedCourses = courses.map((course) => {
      const subscription = subscriptionMap.get(course.id);
      const hasActiveSubscription =
        !!subscription && subscription.cancelAtPeriodEnd !== true;

      return {
        ...serializePrismaData(course),
        // Dados do usuário
        isEnrolled: hasActiveSubscription,
        enrollmentProgress: hasActiveSubscription ? 0 : 0, // TODO: Implementar progresso real
        enrollmentStatus: subscription?.status ?? null,
        completedAt: null, // TODO: Implementar data de conclusão
      };
    });

    return {
      success: true,
      data: {
        courses: serializedCourses,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Erro ao listar cursos com progresso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
