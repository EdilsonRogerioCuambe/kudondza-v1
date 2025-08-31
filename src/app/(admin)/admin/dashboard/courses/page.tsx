import { getCourses } from "@/actions/courses/get-courses";
import { getCourseSeriesList } from "@/actions/courses/series/get-course-series-list";
import { serializeCourseData } from "@/lib/serialize-prisma-data";
import CoursesList from "./_components/courses-list";

export default async function CoursesPage() {
  const coursesResult = await getCourses({ page: 1, limit: 50 });
  const seriesResult = await getCourseSeriesList();

  // Serializar dados dos cursos usando a função utilitária
  const serializedCourses = (
    coursesResult.success ? coursesResult.data?.courses ?? [] : []
  ).map(serializeCourseData);

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
