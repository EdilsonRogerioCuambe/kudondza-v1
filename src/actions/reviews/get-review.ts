"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getReview(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const review = await prisma.review.findUnique({
      where: { id },
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

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
}
