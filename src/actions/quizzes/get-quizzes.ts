"use server";

import prisma from "@/lib/prisma";

export interface GetQuizzesParams {
  page?: number;
  limit?: number;
  search?: string;
  moduleId?: string;
  courseId?: string;
}

export async function getQuizzes({
  page = 1,
  limit = 20,
  search,
  moduleId,
  courseId,
}: GetQuizzesParams = {}) {
  try {
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (moduleId) {
      where.moduleId = moduleId;
    }

    if (courseId) {
      where.module = { courseId };
    }

    // Buscar quizzes
    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          module: {
            select: {
              id: true,
              title: true,
              slug: true,
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
        orderBy: [
          { module: { course: { title: "asc" } } },
          { module: { order: "asc" } },
          { order: "asc" },
        ],
        skip,
        take: limit,
      }),
      prisma.quiz.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        quizzes,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Erro ao buscar quizzes:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
