"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function toggleReviewPublicity(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

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
      throw new Error("Unauthorized to modify this review");
    }

    // Alternar o status de publicidade
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isPublic: !existingReview.isPublic,
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
    console.error("Error toggling review publicity:", error);
    throw error;
  }
}
