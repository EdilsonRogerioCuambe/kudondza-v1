import { getCourse } from "@/actions/courses/get-course";
import { getCourseSeriesList } from "@/actions/courses/series/get-course-series-list";
import { EditPageHeader } from "@/components/ui/edit-page-header";
import { EditPageLayout } from "@/components/ui/edit-page-layout";
import {
  serializeCourseData,
  serializePrismaData,
} from "@/lib/serialize-prisma-data";
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

  // Serializar dados do curso garantindo objetos plain (sem Decimal)
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
    <EditPageLayout>
      <EditPageHeader
        title="Editar Curso"
        subtitle={`Modifique as informações do curso "${course.title}"`}
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Cursos", href: "/admin/dashboard/courses" },
          {
            label: course.title,
            href: `/admin/dashboard/courses/${course.slug}`,
          },
          {
            label: "Editar",
            href: `/admin/dashboard/courses/${course.slug}/edit`,
            isCurrentPage: true,
          },
        ]}
        backHref={`/admin/dashboard/courses/${course.slug}`}
        backLabel="Voltar ao curso"
      />

      <EditCourseForm course={course} series={series} />
    </EditPageLayout>
  );
}
