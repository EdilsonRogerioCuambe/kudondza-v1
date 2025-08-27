"use server";

import prisma from "@/lib/prisma";

/**
 * Busca um curso por ID ou slug
 */
export async function getCourse(identifier: string) {
  try {
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
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
        series: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        prerequisites: {
          include: {
            prerequisite: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                level: true,
              },
            },
          },
        },
        dependentCourses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                level: true,
              },
            },
          },
        },
        relatedCourses: {
          include: {
            targetCourse: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                level: true,
                price: true,
              },
            },
          },
        },
        relatedTo: {
          include: {
            sourceCourse: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                level: true,
                price: true,
              },
            },
          },
        },
        modules: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            _count: {
              select: {
                lessons: true,
                quizzes: true,
                assignments: true,
              },
            },
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

    if (!course) {
      return { success: false, error: "Curso não encontrado" };
    }

    return { success: true, data: course };
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
