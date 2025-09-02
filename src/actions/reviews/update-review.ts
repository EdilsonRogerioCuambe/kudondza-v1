"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export interface UpdateReviewData {
  id: string;
  rating?: number;
  title?: string;
  comment?: string;
  isPublic?: boolean;
}

export async function updateReview(data: UpdateReviewData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const { id, rating, title, comment, isPublic } = data;

    // Buscar a review
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingReview) {
      throw new Error("Review not found");
    }

    // Verificar se o usuário é o dono da review ou é admin
    if (
      existingReview.userId !== session.user.id &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session.user as any).role !== "ADMIN"
    ) {
      throw new Error("Unauthorized to update this review");
    }

    // Validar rating se fornecido
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Atualizar a review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(title !== undefined && { title }),
        ...(comment !== undefined && { comment }),
        ...(isPublic !== undefined && { isPublic }),
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

    return updatedReview;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
}
