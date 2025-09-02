"use server";

import prisma from "@/lib/prisma";

export type PublicReview = {
  id: string;
  rating: number | null;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null } | null;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
  } | null;
};

export async function getPublicReviews(limit = 6): Promise<PublicReview[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, name: true, image: true } },
        course: {
          select: { id: true, title: true, slug: true, thumbnail: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating ?? null,
      title: r.title ?? null,
      comment: r.comment ?? null,
      createdAt: r.createdAt.toISOString(),
      user: r.user
        ? { id: r.user.id, name: r.user.name, image: r.user.image }
        : null,
      course: r.course
        ? {
            id: r.course.id,
            title: r.course.title,
            slug: r.course.slug,
            thumbnail: r.course.thumbnail,
          }
        : null,
    }));
  } catch (error) {
    console.error("Erro ao buscar reviews públicos:", error);
    return [];
  }
}
