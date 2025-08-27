"use server";

import prisma from "@/lib/prisma";
import { CourseFilters, CourseFiltersSchema } from "@/lib/zod-schema";

/**
 * Lista cursos com filtros e paginação
 */
export async function getCourses(
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

    return {
      success: true,
      data: {
        courses,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
