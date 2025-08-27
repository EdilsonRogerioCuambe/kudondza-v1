"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Duplica um curso
 */
export async function duplicateCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true,
            quizzes: true,
            assignments: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    // Gerar novo slug
    const baseSlug = course.slug;
    let newSlug = `${baseSlug}-copy`;
    let counter = 1;

    while (await prisma.course.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${baseSlug}-copy-${counter}`;
      counter++;
    }

    // Criar curso duplicado
    const duplicatedCourse = await prisma.course.create({
      data: {
        title: `${course.title} (Cópia)`,
        slug: newSlug,
        description: course.description,
        shortDescription: course.shortDescription,
        thumbnail: course.thumbnail,
        trailer: course.trailer,
        courseMaterials: course.courseMaterials,
        categoryId: course.categoryId,
        subcategoryId: course.subcategoryId,
        tags: course.tags,
        level: course.level,
        language: course.language,
        duration: course.duration,
        price: course.price,
        originalPrice: course.originalPrice,
        currency: course.currency,
        isPublic: false, // Cópia sempre começa como privada
        isPremium: course.isPremium,
        allowDownload: course.allowDownload,
        hasPrerequisites: course.hasPrerequisites,
        seriesId: course.seriesId,
        unlockCriteria: course.unlockCriteria || undefined,
        seoTitle: course.seoTitle,
        seoDescription: course.seoDescription,
        seoKeywords: course.seoKeywords,
        xpReward: course.xpReward,
        badgeId: course.badgeId,
        instructorId: course.instructorId,
        status: "DRAFT", // Cópia sempre começa como rascunho
      },
    });

    // Duplicar módulos e conteúdo
    for (const courseModule of course.modules) {
      const duplicatedModule = await prisma.module.create({
        data: {
          title: courseModule.title,
          slug: courseModule.slug,
          description: courseModule.description,
          order: courseModule.order,
          isRequired: courseModule.isRequired,
          isPublic: courseModule.isPublic,
          unlockCriteria: courseModule.unlockCriteria || undefined,
          xpReward: courseModule.xpReward,
          courseId: duplicatedCourse.id,
        },
      });

      // Duplicar aulas
      for (const lesson of courseModule.lessons) {
        await prisma.lesson.create({
          data: {
            title: lesson.title,
            description: lesson.description,
            shortDescription: lesson.shortDescription,
            order: lesson.order,
            slug: lesson.slug,
            videoId: lesson.videoId,
            videoUrl: lesson.videoUrl,
            videoDuration: lesson.videoDuration,
            transcript: lesson.transcript,
            isPreview: lesson.isPreview,
            isRequired: lesson.isRequired,
            isPublic: lesson.isPublic,
            unlockCriteria: lesson.unlockCriteria || undefined,
            xpReward: lesson.xpReward,
            moduleId: duplicatedModule.id,
          },
        });
      }

      // Duplicar quizzes
      for (const quiz of courseModule.quizzes) {
        await prisma.quiz.create({
          data: {
            title: quiz.title,
            description: quiz.description,
            order: quiz.order,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            shuffleQuestions: quiz.shuffleQuestions,
            showResults: quiz.showResults,
            xpReward: quiz.xpReward,
            moduleId: duplicatedModule.id,
          },
        });
      }

      // Duplicar assignments
      for (const assignment of courseModule.assignments) {
        await prisma.assignment.create({
          data: {
            title: assignment.title,
            description: assignment.description,
            instructions: assignment.instructions,
            dueDate: assignment.dueDate,
            maxSubmissions: assignment.maxSubmissions,
            allowLateSubmission: assignment.allowLateSubmission,
            maxPoints: assignment.maxPoints,
            rubric: assignment.rubric || undefined,
            xpReward: assignment.xpReward,
            moduleId: duplicatedModule.id,
          },
        });
      }
    }

    revalidatePath("/admin/courses");
    return { success: true, data: duplicatedCourse };
  } catch (error) {
    console.error("Erro ao duplicar curso:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
