"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export interface GetReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
  isVerified?: boolean;
  isPublic?: boolean;
  courseId?: string;
  userId?: string;
  search?: string;
  sortBy?: "createdAt" | "rating" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface GetReviewsResult {
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    isPublic: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    course: {
      id: string;
      title: string;
      slug: string;
      thumbnail: string | null;
    };
  }>;
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function getReviews(
  params: GetReviewsParams = {}
): Promise<GetReviewsResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const {
      page = 1,
      limit = 10,
      rating,
      isVerified,
      isPublic,
      courseId,
      userId,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (rating) {
      where.rating = rating;
    }

    if (typeof isVerified === "boolean") {
      where.isVerified = isVerified;
    }

    if (typeof isPublic === "boolean") {
      where.isPublic = isPublic;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { course: { title: { contains: search, mode: "insensitive" } } },
      ];
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
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
}
