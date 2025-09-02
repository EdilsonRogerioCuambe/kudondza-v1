"use server";

import prisma from "@/lib/prisma";

export type FeaturedCourse = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  level: string;
  language: string;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  duration?: number | null;
  instructorName?: string | null;
  categoryName?: string | null;
  averageRating?: number | null;
  ratingsCount?: number;
  enrollmentsCount?: number;
};

export async function getFeaturedCourses(limit = 8): Promise<FeaturedCourse[]> {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        // isFeatured: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        level: true,
        language: true,
        shortDescription: true,
        price: true,
        originalPrice: true,
        currency: true,
        duration: true,
        instructor: { select: { name: true } },
        category: { select: { name: true } },
        reviews: { select: { rating: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ featuredAt: "desc" }, { viewCount: "desc" }],
      take: limit,
    });

    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      thumbnail: c.thumbnail,
      level: c.level,
      language: c.language,
      shortDescription: c.shortDescription,
      price: Number(c.price ?? 0),
      originalPrice:
        c.originalPrice !== null && c.originalPrice !== undefined
          ? Number(c.originalPrice)
          : null,
      currency: c.currency,
      duration: c.duration ?? null,
      instructorName: c.instructor?.name ?? null,
      categoryName: c.category?.name ?? null,
      averageRating:
        c.reviews && c.reviews.length
          ? c.reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
            c.reviews.length
          : null,
      ratingsCount: c.reviews?.length ?? 0,
      enrollmentsCount: c._count?.enrollments ?? 0,
    }));
  } catch (error) {
    console.error("Erro ao buscar cursos em destaque:", error);
    return [];
  }
}
