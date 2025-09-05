import { getCourse } from "@/actions/courses/get-course";
import { getModulesWithLessonsByCourseId } from "@/actions/courses/modules/get-modules-with-lessons";
import { getCourseSeriesList } from "@/actions/courses/series/get-course-series-list";
import {
  serializeCourseData,
  serializePrismaData,
} from "@/lib/serialize-prisma-data";
import CourseDetails from "./_components/course-details";

interface CoursePageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const courseResult = await getCourse(courseSlug);
  const seriesResult = await getCourseSeriesList();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let modulesWithLessons: any[] = [];
  if (courseResult.success && courseResult.data) {
    const mods = await getModulesWithLessonsByCourseId(courseResult.data.id);
    modulesWithLessons =
      mods.success && mods.data ? serializePrismaData(mods.data) : [];
  }

  if (!courseResult.success || !courseResult.data) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Curso não encontrado
          </h2>
        </div>
        <p>O curso solicitado não foi encontrado.</p>
      </div>
    );
  }

  // Serializar dados do curso usando a função utilitária
  const course = serializePrismaData(serializeCourseData(courseResult.data));

  const series =
    seriesResult.success && seriesResult.data
      ? seriesResult.data.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description ?? undefined,
          thumbnail: s.thumbnail ?? undefined,
          isSequential: Boolean(s.isSequential),
          _count: { courses: s._count?.courses ?? 0 },
        }))
      : [];

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CourseDetails
        course={course}
        series={series}
        modules={modulesWithLessons}
      />
    </main>
  );
}
