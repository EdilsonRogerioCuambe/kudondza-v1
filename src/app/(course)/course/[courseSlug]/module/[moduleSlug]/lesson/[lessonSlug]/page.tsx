import { getCourse } from "@/actions/courses/get-course";
import { getLessonBySlug } from "@/actions/courses/modules/get-lesson";
// import CyberpunkLessonInfo from "@/components/cyberpunk-lesson-info";
import { getUserProgress } from "@/actions/progress/get-user-progress";
import LessonViewer from "@/components/lesson-viewer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/lib/prisma";
import { Clock, Lock, PlayCircle, Unlock } from "lucide-react";
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

  const res = await getLessonBySlug(courseSlug, moduleSlug, lessonSlug);
  if (!res.success || !res.data) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold">Lição não encontrada</h1>
        <p className="text-muted-foreground mt-2">Verifique o link.</p>
        <Link
          href={`/course/${courseSlug}`}
          className="inline-flex mt-6 underline"
        >
          Voltar ao curso
        </Link>
      </div>
    );
  }

  const { lesson, module, course } = res.data;
  const courseRes = await getCourse(courseSlug);
  const fullCourse = courseRes.success ? courseRes.data : null;

  const moduleWithLessons = await prisma.module.findFirst({
    where: { id: module.id },
    select: {
      id: true,
      title: true,
      slug: true,
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          isPreview: true,
          isPublic: true,
          videoDuration: true,
        },
      },
      _count: { select: { lessons: true } },
    },
  });

  // Buscar todos os módulos do curso com aulas, para mostrar o currículo completo
  const allModules = await prisma.module.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      order: true,
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          isPreview: true,
          isPublic: true,
          videoDuration: true,
        },
      },
      _count: { select: { lessons: true } },
    },
  });

  // Buscar progresso do usuário para destacar aulas concluídas (melhor esforço; ignora se sem sessão)
  const completedLessonIds = new Set<string>();
  try {
    const up = await getUserProgress();
    if (up?.lessonProgress) {
      for (const p of up.lessonProgress as unknown as Array<{
        lessonId: string;
        completed: boolean;
      }>) {
        if (p.completed) completedLessonIds.add(p.lessonId);
      }
    }
  } catch {}

  const currentIndex =
    moduleWithLessons?.lessons.findIndex((l) => l.slug === lesson.slug) ?? -1;
  const prevLesson =
    currentIndex > 0 ? moduleWithLessons?.lessons[currentIndex - 1] : undefined;
  const nextLesson =
    moduleWithLessons &&
    currentIndex >= 0 &&
    currentIndex < moduleWithLessons.lessons.length - 1
      ? moduleWithLessons.lessons[currentIndex + 1]
      : undefined;

  return (
    <main className="py-6">
      <div className="container mx-auto px-4">
        {/* Header removido para mais espaço ao player e detalhes */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 space-y-6">
            <LessonViewer
              src={lesson.videoUrl ?? ""}
              title={lesson.title}
              durationSeconds={lesson.videoDuration}
              lessonIndex={lesson.order}
              totalLessons={moduleWithLessons?._count.lessons ?? undefined}
            />

            {/* Meta da aula ao lado grande (abaixo do vídeo) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sobre esta aula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline">
                    {lesson.isRequired ? "Obrigatória" : "Opcional"}
                  </Badge>
                  <Badge variant="outline">
                    {lesson.isPublic ? "Pública" : "Privada"}
                  </Badge>
                  {lesson.isPreview && <Badge variant="outline">Preview</Badge>}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Visão geral</TabsTrigger>
                <TabsTrigger value="transcript">Transcrição</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lesson.description ? (
                      <div className="prose prose-invert max-w-none prose-headings:mt-6 prose-p:leading-relaxed prose-li:my-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {lesson.description}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Sem descrição.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="transcript">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Transcrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lesson.transcript ? (
                      <div className="prose prose-invert max-w-none prose-headings:mt-6 prose-p:leading-relaxed prose-li:my-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {lesson.transcript}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Sem transcrição disponível.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recursos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lesson.resources.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum recurso disponível.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {lesson.resources.map((r) => (
                          <li key={r.id}>
                            <Link
                              href={r.url}
                              target="_blank"
                              className="underline text-sm"
                            >
                              {r.title}
                            </Link>
                            {r.description && (
                              <p className="text-xs text-muted-foreground">
                                {r.description}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold tracking-wide">
                  Currículo do curso
                </h3>
                <Badge variant="outline">
                  {allModules.reduce(
                    (acc, m) => acc + (m._count.lessons || 0),
                    0
                  )}{" "}
                  aulas
                </Badge>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {allModules.map((m) => (
                  <AccordionItem key={m.id} value={m.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex w-full items-center justify-between">
                        <span className="font-medium pr-2 truncate">
                          {m.order}. {m.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {m._count.lessons} aulas
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {m.lessons.map((l) => {
                          const isActive =
                            l.slug === lesson.slug && m.id === module.id;
                          const duration = l.videoDuration ?? 0;
                          const mm = Math.floor(duration / 60);
                          const ss = Math.floor(duration % 60)
                            .toString()
                            .padStart(2, "0");
                          const isCompleted = completedLessonIds.has(l.id);
                          return (
                            <li key={l.id}>
                              <Link
                                href={`/course/${course.slug}/module/${m.slug}/lesson/${l.slug}`}
                                className={
                                  "group flex items-stretch gap-3 rounded-md border px-3 py-2 transition-all " +
                                  (isActive
                                    ? "border-primary/50 bg-primary/10 shadow-sm"
                                    : "border-border hover:border-primary/30 hover:bg-muted/40")
                                }
                              >
                                <div
                                  className={
                                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
                                    (isCompleted
                                      ? "bg-emerald-500 text-white"
                                      : isActive
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-foreground")
                                  }
                                >
                                  {l.order}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div
                                    className={
                                      "truncate text-sm font-medium " +
                                      (isCompleted
                                        ? "text-emerald-600"
                                        : isActive
                                        ? "text-primary"
                                        : "text-foreground")
                                    }
                                  >
                                    {l.title}
                                  </div>
                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> {mm}:{ss}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      {l.isPublic ? (
                                        <Unlock className="h-3 w-3" />
                                      ) : (
                                        <Lock className="h-3 w-3" />
                                      )}
                                      {l.isPublic ? "Pública" : "Privada"}
                                    </span>
                                    {l.isPreview && (
                                      <Badge variant="outline" className="h-5">
                                        Preview
                                      </Badge>
                                    )}
                                    {isCompleted && (
                                      <span className="inline-flex items-center gap-1 text-emerald-600">
                                        ✓ Concluída
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="self-center">
                                  <PlayCircle
                                    className={
                                      "h-4 w-4 transition-colors " +
                                      (isActive
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-primary")
                                    }
                                  />
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Navegação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="text-xs text-muted-foreground">
                    <span className="opacity-80">Curso</span> →{" "}
                    {fullCourse?.title ?? course.title} → {module.title}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      disabled={!prevLesson}
                      className="justify-start"
                    >
                      <Link
                        href={
                          prevLesson
                            ? `/course/${course.slug}/module/${module.slug}/lesson/${prevLesson.slug}`
                            : "#"
                        }
                        aria-disabled={!prevLesson}
                      >
                        ← Anterior
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="default"
                      disabled={!nextLesson}
                      className="justify-end"
                    >
                      <Link
                        href={
                          nextLesson
                            ? `/course/${course.slug}/module/${module.slug}/lesson/${nextLesson.slug}`
                            : "#"
                        }
                        aria-disabled={!nextLesson}
                      >
                        Próxima →
                      </Link>
                    </Button>
                  </div>

                  <Separator className="my-1" />

                  <div className="flex flex-col gap-1 text-sm">
                    <Link
                      href={`/course/${course.slug}/module/${module.slug}`}
                      className="underline"
                    >
                      Ver módulo: {module.title}
                    </Link>
                    <Link href={`/course/${course.slug}`} className="underline">
                      Ver curso: {fullCourse?.title ?? course.title}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
