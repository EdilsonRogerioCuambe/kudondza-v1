import { getLessonBySlug } from "@/actions/courses/modules";
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

  // Garantir que o slug do módulo nunca seja null
  const moduleWithSlug = {
    ...moduleData,
    slug: moduleData.slug || moduleSlug, // Fallback para o slug da URL
  };

  // Constrói um objeto plano e serializável apenas com os campos usados pelo cliente
  const lessonData = {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description ?? undefined,
    shortDescription: lesson.shortDescription ?? undefined,
    order: lesson.order,
    videoId: lesson.videoId ?? undefined,
    videoUrl: lesson.videoUrl ?? undefined,
    videoDuration: lesson.videoDuration ?? undefined,
    transcript: lesson.transcript ?? undefined,
    isPreview: lesson.isPreview,
    isRequired: lesson.isRequired,
    isPublic: lesson.isPublic,
    unlockCriteria: lesson.unlockCriteria,
    xpReward: lesson.xpReward,
    moduleId: lesson.moduleId,
    resources: lesson.resources,
    createdAt: lesson.createdAt.toISOString(),
    updatedAt: lesson.updatedAt.toISOString(),
  };

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Editar Aula</h2>
          <p className="text-muted-foreground">
            Edite as informações da aula {lesson.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {course.title} • {moduleWithSlug.title}
          </p>
        </div>
      </div>

      <EditLessonView
        lesson={lessonData}
        module={moduleWithSlug}
        course={course}
      />
    </main>
  );
}
