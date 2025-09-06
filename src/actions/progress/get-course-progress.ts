"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getCourseProgress(courseSlug: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const userId = session.user.id;

    // Buscar o curso
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true, title: true, slug: true },
    });

    if (!course) {
      return { success: false, error: "Curso não encontrado" };
    }

    // Buscar matrícula do usuário no curso
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: course.id,
      },
      select: {
        id: true,
        status: true,
        progress: true,
        enrolledAt: true,
        completedAt: true,
      },
    });

    // Buscar progresso das lições
    const lessonProgress = await prisma.progress.findMany({
      where: {
        userId,
        lesson: {
          module: {
            courseId: course.id,
          },
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
            module: {
              select: {
                id: true,
                title: true,
                slug: true,
                order: true,
              },
            },
          },
        },
      },
    });

    // Buscar módulos e lições do curso
    const modules = await prisma.module.findMany({
      where: { courseId: course.id },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        order: true,
        lessons: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
            videoDuration: true,
            xpReward: true,
            isPreview: true,
            isPublic: true,
          },
        },
      },
    });

    // Calcular progresso
    const totalLessons = modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );
    const completedLessons = lessonProgress.filter((p) => p.completed).length;
    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Encontrar próxima lição (primeira não completada)
    let nextLesson = null;
    let currentLesson = null;

    for (const courseModule of modules) {
      for (const lesson of courseModule.lessons) {
        const lessonProgressData = lessonProgress.find(
          (p) => p.lessonId === lesson.id
        );

        if (!lessonProgressData || !lessonProgressData.completed) {
          if (!nextLesson) {
            nextLesson = {
              lesson,
              module: courseModule,
            };
          }
          if (!lessonProgressData) {
            currentLesson = {
              lesson,
              module: courseModule,
            };
            break;
          }
        }
      }
      if (currentLesson) break;
    }

    // Mapear lições com status
    const lessonsWithStatus = modules.map((courseModule) => ({
      ...courseModule,
      lessons: courseModule.lessons.map((lesson) => {
        const progressData = lessonProgress.find(
          (p) => p.lessonId === lesson.id
        );
        const isCompleted = progressData?.completed || false;
        const isCurrent = currentLesson?.lesson.id === lesson.id;

        return {
          ...lesson,
          isCompleted,
          isCurrent,
        };
      }),
    }));

    return {
      success: true,
      data: {
        course,
        enrollment: enrollment || null,
        modules: lessonsWithStatus,
        progress: {
          percentage: progressPercentage,
          completedLessons,
          totalLessons,
        },
        nextLesson: nextLesson || null,
        currentLesson: currentLesson || null,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar progresso do curso:", error);
    return {
      success: false,
      error: "Erro ao buscar progresso do curso",
    };
  }
}
