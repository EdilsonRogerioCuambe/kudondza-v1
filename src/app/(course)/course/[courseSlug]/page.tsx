import { getCourse } from "@/actions/courses/get-course";
import { getModulesWithLessonsByCourseId } from "@/actions/courses/modules/get-modules-with-lessons";
import { getQuizzes } from "@/actions/quizzes/get-quizzes";
import { getPublicReviews } from "@/actions/reviews/get-public-reviews";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  serializeCourseData,
  serializePrismaData,
} from "@/lib/serialize-prisma-data";
import { BookOpen, Layers, PlayCircle, Trophy, Users } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;

  const courseRes = await getCourse(courseSlug);
  if (!courseRes.success || !courseRes.data) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold">Curso não encontrado</h1>
        <p className="text-muted-foreground mt-2">
          Verifique o link ou explore outros cursos.
        </p>
        <Link href="/courses" className="inline-flex mt-6 underline">
          Ver cursos
        </Link>
      </div>
    );
  }

  const raw = courseRes.data;
  const course = serializePrismaData(serializeCourseData(raw));
  const modulesRes = await getModulesWithLessonsByCourseId(raw.id);
  const modules = modulesRes.success ? modulesRes.data : [];
  const firstLesson = modules.flatMap((m) => m.lessons).at(0);
  const firstModule = modules.at(0);
  const quizzesRes = await getQuizzes({ courseId: raw.id, limit: 100 });
  const quizzes =
    quizzesRes.success && quizzesRes.data ? quizzesRes.data.quizzes : [];
  const publicReviews = await getPublicReviews(8).catch(() => []);
  const courseReviews = publicReviews.filter(
    (r) => r.course?.slug === course.slug
  );

  return (
    <main className="py-6">
      <div className="container mx-auto px-4">
        <Card className="mb-6 overflow-hidden">
          <div className="p-6 sm:p-8 bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    Curso
                  </Badge>
                  {course.category?.name && (
                    <Badge variant="outline" className="font-mono">
                      {course.category.name}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
                  {course.title}
                </h1>
                {course.shortDescription && (
                  <p className="text-muted-foreground mt-2 max-w-3xl">
                    {course.shortDescription}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />{" "}
                    {course._count?.enrollments ?? 0} alunos
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />{" "}
                    {course._count?.modules ?? 0} módulos
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                {course.instructor && (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={course.instructor.image ?? undefined} />
                      <AvatarFallback>
                        {course.instructor.name?.slice(0, 2).toUpperCase() ??
                          "IN"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {course.instructor.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Instrutor
                      </div>
                    </div>
                  </div>
                )}
                {firstLesson && firstModule && (
                  <Link
                    href={`/course/${course.slug}/module/${firstModule.slug}/lesson/${firstLesson.slug}`}
                    className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <PlayCircle className="h-4 w-4" /> Começar agora
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Curriculum */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold tracking-wide">
                  Conteúdo do curso
                </h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {modules.map((m) => (
                  <AccordionItem key={m.id} value={m.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium pr-2">{m.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {m._count.lessons} aulas
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="mt-2 space-y-1">
                        {m.lessons.map((l) => (
                          <li key={l.id} className="">
                            <Link
                              href={`/course/${course.slug}/module/${m.slug}/lesson/${l.slug}`}
                              className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary transition-colors"
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              <span className="truncate">{l.title}</span>
                              {l.isPreview && (
                                <Badge
                                  variant="outline"
                                  className="ml-auto h-5"
                                >
                                  Preview
                                </Badge>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-8 order-1 lg:order-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Visão geral</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sobre o curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.description ? (
                      <div className="prose prose-invert max-w-none prose-headings:mt-6 prose-p:leading-relaxed prose-li:my-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {course.description}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Sem descrição.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Alunos
                        </div>
                        <div className="text-lg font-semibold">
                          {course._count?.enrollments ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Módulos
                        </div>
                        <div className="text-lg font-semibold">
                          {course._count?.modules ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Reviews
                        </div>
                        <div className="text-lg font-semibold">
                          {course._count?.reviews ?? 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {course.prerequisites?.length ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Pré-requisitos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {course.prerequisites.map(
                          (p: {
                            prerequisite: {
                              id: string;
                              title: string;
                              slug: string;
                            };
                          }) => (
                            <li key={p.prerequisite.id}>
                              <Link
                                href={`/course/${p.prerequisite.slug}`}
                                className="underline"
                              >
                                {p.prerequisite.title}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>

              <TabsContent value="quizzes">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Quizzes do curso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {quizzes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum quiz disponível.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {quizzes.map((q: { id: string; title: string }) => (
                          <li
                            key={q.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Trophy className="h-4 w-4 text-primary" />
                            <span>{q.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      O que estão falando
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {courseReviews.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Ainda não há reviews públicas para este curso.
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {courseReviews.map((r) => (
                          <li key={r.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={r.user?.image ?? undefined} />
                              <AvatarFallback>
                                {r.user?.name?.slice(0, 2).toUpperCase() ??
                                  "US"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">
                                {r.user?.name ?? "Usuário"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </div>
                              {r.comment && (
                                <p className="text-sm mt-1">{r.comment}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </main>
  );
}
