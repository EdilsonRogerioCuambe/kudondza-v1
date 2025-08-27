import { getCourses } from "@/actions/courses/get-courses";
import { getCourseSeriesList } from "@/actions/courses/series/get-course-series-list";
import CoursesList from "./_components/courses-list";

export default async function CoursesPage() {
  const coursesResult = await getCourses({ page: 1, limit: 50 });
  const seriesResult = await getCourseSeriesList();

  // Ensure only plain JSON-friendly data is passed to the client component
  const serializedCourses = (
    coursesResult.success ? coursesResult.data?.courses ?? [] : []
  ).map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description ?? undefined,
    shortDescription: c.shortDescription ?? undefined,
    thumbnail: c.thumbnail ?? undefined,
    status: c.status,
    level: c.level,
    language: c.language,
    price: Number(c.price ?? 0),
    originalPrice:
      c.originalPrice !== null && c.originalPrice !== undefined
        ? Number(c.originalPrice)
        : undefined,
    currency: c.currency,
    isPublic: Boolean(c.isPublic),
    isPremium: Boolean(c.isPremium),
    isFeatured: Boolean(c.isFeatured),
    duration: c.duration ?? undefined,
    tags: Array.isArray(c.tags) ? c.tags : [],
    category: c.category
      ? { id: c.category.id, name: c.category.name, slug: c.category.slug }
      : undefined,
    subcategory: c.subcategory
      ? {
          id: c.subcategory.id,
          name: c.subcategory.name,
          slug: c.subcategory.slug,
        }
      : undefined,
    instructor: c.instructor
      ? {
          id: c.instructor.id,
          name: c.instructor.name,
          email: c.instructor.email,
          image: c.instructor.image ?? undefined,
        }
      : undefined,
    _count: c._count
      ? {
          modules: c._count.modules ?? 0,
          enrollments: c._count.enrollments ?? 0,
          reviews: c._count.reviews ?? 0,
        }
      : { modules: 0, enrollments: 0, reviews: 0 },
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : "",
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : "",
  }));

  const serializedSeries = (
    seriesResult.success && seriesResult.data ? seriesResult.data : []
  ).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description ?? undefined,
    thumbnail: s.thumbnail ?? undefined,
    isSequential: Boolean(s.isSequential),
    _count: { courses: s._count?.courses ?? 0 },
  }));

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cursos</h2>
      </div>

      <CoursesList
        initialCourses={serializedCourses}
        initialSeries={serializedSeries}
      />
    </main>
  );
}
