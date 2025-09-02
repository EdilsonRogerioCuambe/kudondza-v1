"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export interface GetReviewsByUserParams {
  userId: string;
  page?: number;
  limit?: number;
  rating?: number;
  isPublic?: boolean;
  sortBy?: "createdAt" | "rating" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export async function getReviewsByUser(params: GetReviewsByUserParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const {
      userId,
      page = 1,
      limit = 10,
      rating,
      isPublic,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = { userId };

    if (rating) {
      where.rating = rating;
    }

    if (typeof isPublic === "boolean") {
      where.isPublic = isPublic;
    }

    // Buscar reviews
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
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
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}
