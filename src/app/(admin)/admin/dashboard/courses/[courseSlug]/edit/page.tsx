import { getCourse } from "@/actions/courses/get-course";
import { getCourseSeriesList } from "@/actions/courses/series/get-course-series-list";
import { serializeCourseData } from "@/lib/serialize-prisma-data";
import EditCourseForm from "./_components/edit-course-form";

interface EditCoursePageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function EditCourseRoute({ params }: EditCoursePageProps) {
  const resolved = await params;
  const { courseSlug } = resolved;

  const courseResult = await getCourse(courseSlug);
  const seriesResult = await getCourseSeriesList();

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
  const course = serializeCourseData(courseResult.data);

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
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Editar Curso</h2>
      </div>

      <EditCourseForm course={course} series={series} />
    </main>
  );
}
