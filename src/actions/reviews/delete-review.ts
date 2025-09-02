"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function deleteReview(id: string) {
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
      throw new Error("Unauthorized to delete this review");
    }

    // Deletar a review
    await prisma.review.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}
