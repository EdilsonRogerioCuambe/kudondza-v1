import { getCourse } from "@/actions/courses/get-course";
import { getLessonBySlug } from "@/actions/courses/lessons/get-lesson-by-slug";
import { getModulesWithLessonsByCourseId } from "@/actions/courses/modules/get-modules-with-lessons";
import { LessonActions } from "@/components/ui/lesson-actions";
import { LessonNavigation } from "@/components/ui/lesson-navigation";
import { LessonResources } from "@/components/ui/lesson-resources";
import { LessonSidebar } from "@/components/ui/lesson-sidebar";
import { LessonViewer } from "@/components/ui/lesson-viewer";
import { ViewPageLayout } from "@/components/ui/view-page-layout";
import {
  serializeCourseData,
  serializePrismaData,
} from "@/lib/serialize-prisma-data";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// Tipos baseados nos dados reais do Prisma
interface PrismaCourse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  trailer?: string;
  courseMaterials?: string;
  categoryId: string;
  subcategoryId?: string;
  tags: string[];
  level: string;
  language: string;
  duration?: number;
  price: number;
  originalPrice?: number;
  currency: string;
  isPublic: boolean;
  isPremium: boolean;
  allowDownload: boolean;
  hasPrerequisites: boolean;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  instructorId: string;
  [key: string]: unknown;
}

interface PrismaModule {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  order: number;
  isRequired: boolean;
  isPublic: boolean;
  lessons: PrismaLesson[];
  _count: {
    lessons: number;
  };
}

interface PrismaLesson {
  id: string;
  title: string;
  slug: string | null;
  order: number;
  isPublic: boolean;
  isPreview: boolean;
  module?: {
    id: string;
    title: string;
    slug: string | null;
    courseId: string;
    course: {
      id: string;
      title: string;
      slug: string;
    };
  };
  resources?: PrismaResource[];
  [key: string]: unknown;
}

interface PrismaResource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string;
  fileSize: number | null;
  mimeType: string | null;
  downloadable: boolean;
  createdAt: Date;
}

// Funções de adaptação para converter tipos Prisma para tipos dos componentes
function adaptCourse(prismaCourse: PrismaCourse) {
  return {
    ...prismaCourse,
    publishedAt: prismaCourse.publishedAt
      ? new Date(prismaCourse.publishedAt)
      : undefined,
    createdAt: new Date(prismaCourse.createdAt),
    updatedAt: new Date(prismaCourse.updatedAt),
  };
}

function adaptModule(prismaModule: PrismaModule) {
  return {
    ...prismaModule,
    slug: prismaModule.slug || undefined,
    description: prismaModule.description || undefined,
    xpReward: 100, // valor padrão
    createdAt: new Date(),
    updatedAt: new Date(),
    courseId: "", // será preenchido pelo contexto
    lessons: prismaModule.lessons.map(adaptLesson),
  };
}

function adaptLesson(prismaLesson: PrismaLesson) {
  return {
    ...prismaLesson,
    slug: prismaLesson.slug || undefined,
    description:
      typeof prismaLesson.description === "string"
        ? prismaLesson.description
        : undefined,
    isRequired: true, // valor padrão
    xpReward: 50, // valor padrão
    createdAt: new Date(),
    updatedAt: new Date(),
    moduleId: prismaLesson.module?.id || "",
    resources: prismaLesson.resources?.map(adaptResource),
  };
}

function adaptResource(prismaResource: PrismaResource) {
  return {
    ...prismaResource,
    description: prismaResource.description || undefined,
    updatedAt: new Date(),
    lessonId: "", // será preenchido pelo contexto
  };
}

interface PageProps {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;

  // Buscar dados do curso
  const courseRes = await getCourse(courseSlug);
  if (!courseRes.success || !courseRes.data) {
    notFound();
  }

  const prismaCourse = serializePrismaData(
    serializeCourseData(courseRes.data)
  ) as PrismaCourse;
  const course = adaptCourse(prismaCourse);

  // Buscar dados da lição
  const lessonRes = await getLessonBySlug(lessonSlug);
  if (!lessonRes.success || !lessonRes.data) {
    notFound();
  }

  const prismaLesson = lessonRes.data as PrismaLesson;
  const lesson = adaptLesson(prismaLesson);

  // Verificar se a lição pertence ao curso correto
  if (prismaLesson.module?.courseId !== course.id) {
    redirect(`/courses/${courseSlug}`);
  }

  // Buscar módulos do curso para navegação
  const modulesRes = await getModulesWithLessonsByCourseId(course.id);
  const prismaModules = (
    modulesRes && modulesRes.success ? modulesRes.data : []
  ) as PrismaModule[];
  const modules = prismaModules.map(adaptModule);

  // Encontrar o módulo atual
  const currentModule = modules.find((m) => m.slug === moduleSlug);
  if (!currentModule) {
    redirect(`/courses/${courseSlug}`);
  }

  // Encontrar a lição atual no módulo
  const currentLesson = currentModule.lessons?.find(
    (l) => l.slug === lessonSlug
  );
  if (!currentLesson) {
    redirect(`/courses/${courseSlug}`);
  }

  // Calcular progresso do curso
  const totalLessons = modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );

  // TODO: Implementar busca do progresso real do usuário
  const completedLessons = 0;
  const courseProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <ViewPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header com breadcrumb */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link
                href="/courses"
                className="hover:text-primary transition-colors"
              >
                Cursos
              </Link>
              <span>/</span>
              <Link
                href={`/courses/${course.slug}`}
                className="hover:text-primary transition-colors truncate max-w-[200px]"
              >
                {course.title}
              </Link>
              <span>/</span>
              <Link
                href={`/courses/${course.slug}/learn`}
                className="hover:text-primary transition-colors"
              >
                Aprender
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[150px]">
                {currentModule.title}
              </span>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {currentLesson.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Sidebar com lista de lições */}
            <div className="xl:col-span-1 order-2 xl:order-1">
              <div className="sticky top-6">
                <LessonSidebar
                  course={course}
                  modules={modules}
                  currentModule={currentModule}
                  currentLesson={currentLesson}
                  courseProgress={courseProgress}
                />
              </div>
            </div>

            {/* Conteúdo principal da lição */}
            <div className="xl:col-span-3 order-1 xl:order-2">
              <div className="space-y-6">
                {/* Navegação entre lições */}
                <LessonNavigation
                  course={course}
                  modules={modules}
                  currentModule={currentModule}
                  currentLesson={currentLesson}
                />

                {/* Player de vídeo e conteúdo */}
                <LessonViewer
                  lesson={lesson}
                  course={course}
                  module={currentModule}
                />

                {/* Ações da lição */}
                <LessonActions
                  lesson={lesson}
                  course={course}
                  module={currentModule}
                />

                {/* Recursos da lição */}
                {lesson.resources && lesson.resources.length > 0 && (
                  <LessonResources
                    resources={lesson.resources}
                    lesson={lesson}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewPageLayout>
  );
}
