"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export interface GetReviewsByCourseParams {
  courseId: string;
  page?: number;
  limit?: number;
  rating?: number;
  isVerified?: boolean;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
}

export async function getReviewsByCourse(params: GetReviewsByCourseParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const {
      courseId,
      page = 1,
      limit = 10,
      rating,
      isVerified,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {
      courseId,
      isPublic: true, // Apenas reviews públicas
    };

    if (rating) {
      where.rating = rating;
    }

    if (typeof isVerified === "boolean") {
      where.isVerified = isVerified;
    }

    // Buscar reviews
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        } as Record<string, "asc" | "desc">,
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reviews,
      total,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    throw error;
  }
}
