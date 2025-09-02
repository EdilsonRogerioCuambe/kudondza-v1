"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function toggleReviewVerification(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Apenas admins podem verificar reviews
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any).role !== "ADMIN") {
      throw new Error("Only admins can verify reviews");
    }

    // Buscar a review
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new Error("Review not found");
    }

    // Alternar o status de verificação
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isVerified: !existingReview.isVerified,
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
    console.error("Error toggling review verification:", error);
    throw error;
  }
}
