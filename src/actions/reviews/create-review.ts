"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export interface CreateReviewData {
  rating: number;
  title?: string;
  comment?: string;
  courseId: string;
  isPublic?: boolean;
}

export async function createReview(data: CreateReviewData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const { rating, title, comment, courseId, isPublic = true } = data;

    // Validar rating
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Verificar se o usuário já fez review para este curso
    const existingReview = await prisma.review.findUnique({
      where: {
        unique_review: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this course");
    }

    // Verificar se o curso existe
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Criar a review
    const review = await prisma.review.create({
      data: {
        rating,
        title,
        comment,
        isPublic,
        userId: session.user.id,
        courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
    });

    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}
