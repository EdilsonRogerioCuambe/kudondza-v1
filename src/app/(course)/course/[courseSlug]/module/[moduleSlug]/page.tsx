import { getCourse } from "@/actions/courses/get-course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { Layers, ListVideo, Trophy } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ courseSlug: string; moduleSlug: string }>;
}) {
  const { courseSlug, moduleSlug } = await params;

  const courseRes = await getCourse(courseSlug);
  if (!courseRes.success || !courseRes.data) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold">Curso não encontrado</h1>
        <p className="text-muted-foreground mt-2">Verifique o link.</p>
      </div>
    );
  }

  const course = courseRes.data;
  const moduleData = await prisma.module.findFirst({
    where: { courseId: course.id, slug: moduleSlug },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      order: true,
      isPublic: true,
      isRequired: true,
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          isPreview: true,
          isPublic: true,
        },
      },
      quizzes: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, order: true },
      },
      _count: { select: { lessons: true } },
    },
  });

  if (!moduleData) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold">Módulo não encontrado</h1>
        <p className="text-muted-foreground mt-2">Verifique o link.</p>
      </div>
    );
  }

  return (
    <main className="py-6">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">
              Módulo
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight">
              {moduleData.title}
            </h1>
          </div>
          {moduleData.description && (
            <p className="text-muted-foreground mt-2 max-w-3xl">
              {moduleData.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold tracking-wide">
                  Aulas do módulo
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="lessons">
                  <AccordionTrigger className="text-sm">
                    {moduleData._count.lessons} aulas
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1">
                      {moduleData.lessons.map((l) => (
                        <li key={l.id}>
                          <Link
                            href={`/course/${course.slug}/module/${moduleData.slug}/lesson/${l.slug}`}
                            className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary"
                          >
                            <ListVideo className="h-4 w-4" />
                            <span className="truncate">
                              {l.order}. {l.title}
                            </span>
                            {l.isPreview && (
                              <Badge variant="outline" className="ml-auto h-5">
                                Preview
                              </Badge>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </aside>

          <section className="lg:col-span-8 order-1 lg:order-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Quizzes deste módulo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {moduleData.quizzes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum quiz disponível neste módulo.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {moduleData.quizzes.map((q) => (
                      <li key={q.id} className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {q.order}. {q.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Como começar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Selecione uma aula na lista para começar a estudar este
                  módulo.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
