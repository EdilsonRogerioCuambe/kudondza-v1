import { getCourse } from "@/actions/courses/get-course";
import { getLessonBySlug } from "@/actions/courses/modules/get-lesson";
import { getModulesWithLessonsByCourseId } from "@/actions/courses/modules/get-modules-with-lessons";
import CourseCard from "@/components/course-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/video-player";
import {
  serializeCourseData,
  serializePrismaData,
} from "@/lib/serialize-prisma-data";
import {
  Clock,
  Download,
  Eye,
  Home,
  Layers,
  Lock,
  PlayCircle,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page({
  params,
}: {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;

  // Buscar dados da lição
  const lessonRes = await getLessonBySlug(courseSlug, moduleSlug, lessonSlug);
  if (!lessonRes.success || !lessonRes.data) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">Lição não encontrada</h1>
        <p className="text-muted-foreground mt-2">
          Verifique o link ou explore outros cursos.
        </p>
        <Link
          href="/courses"
          className={buttonVariants({ variant: "default", className: "mt-6" })}
        >
          Ver cursos
        </Link>
      </div>
    );
  }

  const { lesson, module, course } = lessonRes.data;

  // Buscar dados completos do curso
  const courseRes = await getCourse(courseSlug);
  const fullCourse = courseRes.success ? courseRes.data : null;
  const serializedCourse = fullCourse
    ? serializePrismaData(serializeCourseData(fullCourse))
    : null;

  // Buscar módulos do curso
  const modulesRes = await getModulesWithLessonsByCourseId(course.id).catch(
    () => ({ success: false } as const)
  );
  const modules = modulesRes && modulesRes.success ? modulesRes.data : [];

  const hasDiscount =
    serializedCourse &&
    typeof serializedCourse.originalPrice === "number" &&
    serializedCourse.originalPrice > serializedCourse.price;

  return (
    <div className="py-8 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Início
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/courses">Cursos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/courses/${course.slug}`}
                className="truncate max-w-[150px] sm:max-w-[200px]"
              >
                {course.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/courses/${course.slug}`}
                className="truncate max-w-[120px] sm:max-w-[150px]"
              >
                {module.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[120px] sm:max-w-[150px]">
              {lesson.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Preview Badge */}
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          <Eye className="h-3 w-3 mr-1" />
          Preview Gratuito
        </Badge>
        {lesson.isRequired && (
          <Badge variant="outline">
            <Star className="h-3 w-3 mr-1" />
            Obrigatória
          </Badge>
        )}
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {lesson.title}
          </h1>
          {lesson.shortDescription && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {lesson.shortDescription}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <Layers className="h-4 w-4" />
              {module.title}
            </span>
            {lesson.videoDuration && (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {Math.round((Number(lesson.videoDuration) / 60) * 10) / 10}h
              </span>
            )}
            {lesson.xpReward && (
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {lesson.xpReward} XP
              </span>
            )}
          </div>

          {/* Video Player */}
          {lesson.videoUrl ? (
            <div className="mt-6">
              <VideoPlayer
                src={lesson.videoUrl}
                title={lesson.title}
                disallowPiP
                disallowDownload
                className="w-full max-w-4xl"
              />
            </div>
          ) : (
            <div className="mt-6 p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
              <PlayCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Vídeo não disponível no preview
              </p>
            </div>
          )}
        </div>

        {/* Course Info Card */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl">Acesse o curso completo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {serializedCourse?.thumbnail && (
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={serializedCourse.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </AspectRatio>
              )}
              <div className="flex items-baseline gap-3">
                {serializedCourse?.price === 0 ? (
                  <span className="text-2xl font-semibold text-green-600">
                    Gratuito
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-bold">
                      {serializedCourse?.currency}{" "}
                      {Number(serializedCourse?.price || 0).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {serializedCourse?.currency}{" "}
                        {Number(serializedCourse?.originalPrice || 0).toFixed(
                          2
                        )}
                      </span>
                    )}
                  </>
                )}
              </div>
              <Link
                href={`/checkout/${course.slug}`}
                className={buttonVariants({ size: "lg", className: "w-full" })}
              >
                {serializedCourse?.price === 0
                  ? "Começar agora"
                  : "Comprar curso"}
              </Link>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Acesso mensal</li>
                <li>• Certificado de conclusão</li>
                <li>• Atualizações futuras incluídas</li>
                <li>• Suporte da comunidade</li>
                {serializedCourse?.language && (
                  <li>• Idioma: {serializedCourse.language}</li>
                )}
                {serializedCourse?.duration && (
                  <li>
                    • Carga horária:{" "}
                    {Math.round((Number(serializedCourse.duration) / 60) * 10) /
                      10}
                    h
                  </li>
                )}
                {serializedCourse?.allowDownload && (
                  <li>• Download de materiais incluso</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Lesson Description */}
      {lesson.description && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Sobre esta lição</h2>
          {/<[^>]+>/.test(lesson.description) ? (
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.description }}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.description}
              </ReactMarkdown>
            </div>
          )}
        </section>
      )}

      {/* Transcript */}
      {lesson.transcript && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Transcrição</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.transcript}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Recursos da lição</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  {resource.description && (
                    <p className="line-clamp-2">{resource.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                    <Link
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: "link",
                        size: "sm",
                      })}
                    >
                      Acessar
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Separator />

      {/* Course Curriculum */}
      {modules?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conteúdo do curso</h2>
          <Accordion type="single" collapsible className="w-full">
            {modules.map((m, mIdx: number) => (
              <AccordionItem key={m.id} value={`module-${m.id}`}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="font-medium">{m.title}</div>
                      {m.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {m.description}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {m.lessons?.length ?? 0} aulas
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {(m.lessons || []).map((l, idx: number) => (
                      <div
                        key={l.id}
                        className={`flex items-center justify-between rounded border p-3 text-sm ${
                          l.id === lesson.id
                            ? "bg-primary/10 border-primary"
                            : ""
                        }`}
                      >
                        <div className="truncate">
                          {mIdx + 1}.{idx + 1} {l.title}
                        </div>
                        {l.isPreview ? (
                          <Link
                            href={`/courses/${course.slug}/preview/${m.slug}/${l.slug}`}
                            className={buttonVariants({
                              variant: l.id === lesson.id ? "default" : "link",
                              size: "sm",
                            })}
                          >
                            <span className="inline-flex items-center gap-1">
                              <PlayCircle className="h-4 w-4" />
                              {l.id === lesson.id ? "Atual" : "Preview"}
                            </span>
                          </Link>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="inline-flex items-center gap-1"
                          >
                            <Lock className="h-3 w-3" /> Bloqueado
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Related Courses */}
      {serializedCourse?.relatedCourses &&
        serializedCourse.relatedCourses.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Cursos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serializedCourse.relatedCourses
                .slice(0, 6)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((rel: any) =>
                  rel.targetCourse ? (
                    <CourseCard
                      key={rel.targetCourse.id}
                      id={rel.targetCourse.id}
                      title={rel.targetCourse.title}
                      slug={rel.targetCourse.slug}
                      thumbnail={rel.targetCourse.thumbnail}
                      level={rel.targetCourse.level}
                      language={serializedCourse?.language}
                      shortDescription={null}
                      price={Number(rel.targetCourse.price ?? 0)}
                      originalPrice={null}
                      currency={serializedCourse?.currency}
                    />
                  ) : null
                )}
            </div>
          </section>
        )}
    </div>
  );
}
