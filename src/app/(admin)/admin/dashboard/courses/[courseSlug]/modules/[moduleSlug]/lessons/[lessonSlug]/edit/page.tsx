import { getLessonBySlug } from "@/actions/courses/modules";
import { EditPageHeader } from "@/components/ui/edit-page-header";
import { EditPageLayout } from "@/components/ui/edit-page-layout";
import { serializePrismaData } from "@/lib/serialize-prisma-data";
import { notFound } from "next/navigation";
import EditLessonView from "./_components/edit-lesson-page";

interface EditLessonPageProps {
  params: {
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };
}

export default async function EditLessonRoute({ params }: EditLessonPageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = params;

  // Buscar dados da lição
  const lessonResult = await getLessonBySlug(
    courseSlug,
    moduleSlug,
    lessonSlug
  );

  if (!lessonResult.success || !lessonResult.data) {
    notFound();
  }

  const { lesson, module: moduleData, course } = lessonResult.data;

  // Serialize all Prisma data to ensure it's safe for Client Components
  const serializedData = serializePrismaData({
    lesson,
    module: moduleData,
    course,
  });
  const {
    lesson: serializedLesson,
    module: serializedModule,
    course: serializedCourse,
  } = serializedData;

  // Garantir que o slug do módulo nunca seja null
  const moduleWithSlug = {
    ...serializedModule,
    slug: serializedModule.slug || moduleSlug, // Fallback para o slug da URL
  };

  // Constrói um objeto plano e serializável apenas com os campos usados pelo cliente
  const lessonData = {
    id: serializedLesson.id,
    title: serializedLesson.title,
    slug: serializedLesson.slug,
    description: serializedLesson.description ?? undefined,
    shortDescription: serializedLesson.shortDescription ?? undefined,
    order: serializedLesson.order,
    videoId: serializedLesson.videoId ?? undefined,
    videoUrl: serializedLesson.videoUrl ?? undefined,
    videoDuration: serializedLesson.videoDuration ?? undefined,
    transcript: serializedLesson.transcript ?? undefined,
    isPreview: serializedLesson.isPreview,
    isRequired: serializedLesson.isRequired,
    isPublic: serializedLesson.isPublic,
    unlockCriteria: serializedLesson.unlockCriteria,
    xpReward: serializedLesson.xpReward,
    moduleId: serializedLesson.moduleId,
    resources: serializedLesson.resources,
    createdAt: serializedLesson.createdAt,
    updatedAt: serializedLesson.updatedAt,
  };

  return (
    <EditPageLayout>
      <EditPageHeader
        title="Editar Aula"
        subtitle={`Edite as informações da aula "${serializedLesson.title}"`}
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Cursos", href: "/admin/dashboard/courses" },
          {
            label: serializedCourse.title,
            href: `/admin/dashboard/courses/${serializedCourse.slug}`,
          },
          {
            label: moduleWithSlug.title,
            href: `/admin/dashboard/courses/${serializedCourse.slug}/modules/${moduleWithSlug.slug}`,
          },
          {
            label: serializedLesson.title,
            href: `/admin/dashboard/courses/${serializedCourse.slug}/modules/${moduleWithSlug.slug}/lessons/${serializedLesson.slug}/edit`,
            isCurrentPage: true,
          },
        ]}
        backHref={`/admin/dashboard/courses/${serializedCourse.slug}/modules/${moduleWithSlug.slug}`}
        backLabel="Voltar ao módulo"
      />

      <EditLessonView
        lesson={lessonData}
        module={moduleWithSlug}
        course={serializedCourse}
      />
    </EditPageLayout>
  );
}
