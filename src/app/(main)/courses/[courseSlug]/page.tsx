import { getCourse } from "@/actions/courses/get-course";
import { getModulesWithLessonsByCourseId } from "@/actions/courses/modules/get-modules-with-lessons";
import { getPublicReviews } from "@/actions/reviews/get-public-reviews";
import CourseCard from "@/components/course-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  serializeCourseData,
  serializePrismaData,
} from "@/lib/serialize-prisma-data";
import { BookOpen, Layers, Lock, PlayCircle, Users } from "lucide-react";
import Image from "next/image";
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
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">Curso não encontrado</h1>
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

  const raw = courseRes.data;
  const course = serializePrismaData(serializeCourseData(raw));
  const modulesRes = await getModulesWithLessonsByCourseId(raw.id).catch(
    () => ({ success: false } as const)
  );
  const modules = modulesRes && modulesRes.success ? modulesRes.data : [];
  const publicReviews = await getPublicReviews(6).catch(() => []);
  const courseReviews = publicReviews.filter(
    (r) => r.course?.slug === course.slug
  );

  const hasDiscount =
    typeof course.originalPrice === "number" &&
    course.originalPrice > course.price;

  return (
    <div className="py-8 space-y-10">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {course.title}
          </h1>
          {course.shortDescription ? (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {course.shortDescription}
            </p>
          ) : null}
          <div className="flex items-center gap-3 text-sm">
            {course.level ? (
              <span className="inline-flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {course.level}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              {course._count?.enrollments ?? 0} alunos
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {course._count?.modules ?? 0} módulos
            </span>
          </div>
          {course.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {course.tags.slice(0, 6).map((t: string) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}
          {/* Trailer ou imagem */}
          {course.trailer ? (
            <div className="mt-4">
              <AspectRatio ratio={16 / 9}>
                <video
                  className="w-full h-full rounded-md bg-black"
                  controls
                  poster={course.thumbnail ?? undefined}
                  preload="metadata"
                >
                  <source src={course.trailer} />
                  Seu navegador não suporta a tag de vídeo.
                </video>
              </AspectRatio>
            </div>
          ) : course.thumbnail ? (
            <div className="mt-4">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover rounded-md"
                />
              </AspectRatio>
            </div>
          ) : null}
        </div>

        {/* Purchase/Enroll Card */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl">Acesse este curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.thumbnail ? (
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </AspectRatio>
              ) : null}
              <div className="flex items-baseline gap-3">
                {course.price === 0 ? (
                  <span className="text-2xl font-semibold text-green-600">
                    Gratuito
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-bold">
                      {course.currency} {Number(course.price).toFixed(2)}
                    </span>
                    {hasDiscount ? (
                      <span className="text-sm text-muted-foreground line-through">
                        {course.currency}{" "}
                        {Number(course.originalPrice).toFixed(2)}
                      </span>
                    ) : null}
                  </>
                )}
              </div>
              <Link
                href={`/checkout/${course.slug}`}
                className={buttonVariants({ size: "lg", className: "w-full" })}
              >
                {course.price === 0 ? "Começar agora" : "Comprar curso"}
              </Link>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Acesso vitalício</li>
                <li>• Certificado de conclusão</li>
                <li>• Atualizações futuras incluídas</li>
                <li>• Suporte da comunidade</li>
                {course.language ? <li>• Idioma: {course.language}</li> : null}
                {course.duration ? (
                  <li>• Carga horária: {course.duration} min</li>
                ) : null}
                {course.allowDownload ? (
                  <li>• Download de materiais incluso</li>
                ) : null}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* What you'll learn / Long description */}
      {course.description ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Sobre o curso</h2>
          {/<[^>]+>/.test(course.description) ? (
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {course.description}
              </ReactMarkdown>
            </div>
          )}
        </section>
      ) : null}

      <Separator />

      {/* Curriculum */}
      {modules?.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conteúdo do curso</h2>
          <Accordion type="single" collapsible className="w-full">
            {modules.map((m, mIdx: number) => (
              <AccordionItem key={m.id} value={`module-${m.id}`}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="font-medium">{m.title}</div>
                      {m.description ? (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {m.description}
                        </div>
                      ) : null}
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
                        className="flex items-center justify-between rounded border p-3 text-sm"
                      >
                        <div className="truncate">
                          {mIdx + 1}.{idx + 1} {l.title}
                        </div>
                        {l.isPreview ? (
                          <Link
                            href={`/courses/${course.slug}/preview/${m.slug}/${l.slug}`}
                            className={buttonVariants({
                              variant: "link",
                              size: "sm",
                            })}
                          >
                            <span className="inline-flex items-center gap-1">
                              <PlayCircle className="h-4 w-4" /> Preview
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
      ) : null}

      {/* Instructor */}
      {course.instructor ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Instrutor</h2>
          <div className="flex items-center gap-3">
            {course.instructor.image ? (
              <Image
                src={course.instructor.image}
                alt={course.instructor.name}
                width={48}
                height={48}
                className="rounded-full object-cover w-14 h-14"
              />
            ) : null}
            <div>
              <div className="font-medium">{course.instructor.name}</div>
              <div className="text-xs text-muted-foreground">
                {course.instructor.email}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Reviews */}
      {courseReviews.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Depoimentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseReviews.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {r.user?.name ?? "Usuário"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  {typeof r.rating === "number" ? (
                    <div className="text-foreground">
                      Nota: {r.rating.toFixed(1)}
                    </div>
                  ) : null}
                  <p className="line-clamp-4">
                    {r.comment || r.title || "Sem comentário"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Related courses */}
      {course.relatedCourses?.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cursos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.relatedCourses
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
                    language={course.language}
                    shortDescription={null}
                    price={Number(rel.targetCourse.price ?? 0)}
                    originalPrice={null}
                    currency={course.currency}
                  />
                ) : null
              )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
