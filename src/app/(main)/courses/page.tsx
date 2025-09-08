import { getCategories } from "@/actions/categories/get-categories";
import { getCoursesWithProgress } from "@/actions/courses/get-courses-with-progress";
import { Badge } from "@/components/ui/badge";
// removed unused UI imports after adopting CourseCard
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CourseFilters, CourseLevel } from "@/lib/zod-schema";
// removed unused Image import
import CourseCard from "@/components/course-card";
// removed unused Link import
import FiltersBar from "./_components/filters-bar";

function toNumber(value: string | string[] | undefined, fallback: number) {
  if (!value) return fallback;
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const page = toNumber(resolvedSearchParams?.page, 1);
  const limit = toNumber(resolvedSearchParams?.limit, 12);

  const filters: CourseFilters = {
    page,
    limit,
    search: (resolvedSearchParams?.search as string) || undefined,
    categoryId: (resolvedSearchParams?.categoryId as string) || undefined,
    subcategoryId: (resolvedSearchParams?.subcategoryId as string) || undefined,
    level: (resolvedSearchParams?.level as CourseLevel) || undefined,
    isPublic: true,
    isPremium:
      (resolvedSearchParams?.isPremium as string) === "true" ? true : undefined,
    language: (resolvedSearchParams?.language as string) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sortBy: (resolvedSearchParams?.sortBy as any) || "createdAt",
    sortOrder: (resolvedSearchParams?.sortOrder as "asc" | "desc") || "desc",
    minPrice: resolvedSearchParams?.minPrice
      ? Number(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams?.maxPrice
      ? Number(resolvedSearchParams.maxPrice)
      : undefined,
    tags: resolvedSearchParams?.tags
      ? Array.isArray(resolvedSearchParams.tags)
        ? (resolvedSearchParams.tags as string[])
        : [resolvedSearchParams.tags as string]
      : undefined,
  };

  const [coursesRes, categoriesRes] = await Promise.all([
    getCoursesWithProgress(filters),
    getCategories({
      page: 1,
      limit: 100,
      isActive: true,
      sortBy: "name",
      sortOrder: "asc",
    }),
  ]);

  const categories =
    categoriesRes.success && categoriesRes.data
      ? categoriesRes.data.categories
      : [];

  const data =
    coursesRes.success && coursesRes.data
      ? coursesRes.data
      : { courses: [], total: 0, page, limit, totalPages: 0 };

  return (
    <div className="py-10">
      <div className="mb-8 space-y-3">
        <Badge variant="outline">Cursos</Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Encontre o curso ideal
        </h1>
        <p className="text-muted-foreground">
          Pesquise por categoria, nível, idioma e muito mais.
        </p>
      </div>

      <FiltersBar categories={categories} initialParams={filters} />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.courses.map((c) => (
          <CourseCard
            key={c.id}
            id={c.id}
            title={c.title}
            slug={c.slug}
            thumbnail={c.thumbnail ?? null}
            level={c.level}
            language={c.language}
            shortDescription={c.shortDescription ?? null}
            price={Number(c.price)}
            originalPrice={
              c.originalPrice != null ? Number(c.originalPrice) : null
            }
            currency={c.currency}
            duration={c.duration ?? null}
            instructorName={c.instructor?.name}
            categoryName={c.category?.name}
            averageRating={undefined}
            ratingsCount={undefined}
            enrollmentsCount={c._count?.enrollments}
            // Novos props para progresso
            isEnrolled={c.isEnrolled}
            enrollmentProgress={c.enrollmentProgress}
            enrollmentStatus={c.enrollmentStatus}
            completedAt={c.completedAt}
          />
        ))}
      </div>

      {data.totalPages > 1 ? (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/courses?page=${Math.max(1, data.page - 1)}&limit=${
                    data.limit
                  }`}
                />
              </PaginationItem>
              {Array.from({ length: data.totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href={`/courses?page=${i + 1}&limit=${data.limit}`}
                    isActive={data.page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={`/courses?page=${Math.min(
                    data.totalPages,
                    data.page + 1
                  )}&limit=${data.limit}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}
