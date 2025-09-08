import { getCourse } from "@/actions/courses/get-course";
import { getModulesWithLessonsByCourseId } from "@/actions/courses/modules/get-modules-with-lessons";
import { getCourseProgress } from "@/actions/progress/get-course-progress";
import { getPublicReviews } from "@/actions/reviews/get-public-reviews";
import { getUserSubscriptionForCourse } from "@/actions/subscriptions/get-user-subscription-for-course";
import { buttonVariants } from "@/components/ui/button";
import { CoursePageClient } from "@/components/ui/course-page-client";
import {
  serializeCourseData,
  serializePrismaData,
} from "@/lib/serialize-prisma-data";
import Link from "next/link";

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

  // Verificar se o usuário tem assinatura ativa para este curso
  const subscriptionRes = await getUserSubscriptionForCourse(raw.id);
  const hasActiveSubscription =
    subscriptionRes.success &&
    subscriptionRes.data !== null &&
    subscriptionRes.data.cancelAtPeriodEnd !== true;

  // Buscar progresso do usuário no curso
  const progressRes = await getCourseProgress(courseSlug);
  const userProgress = progressRes.success
    ? progressRes.data?.progress?.percentage || 0
    : 0;

  // Calcular estatísticas
  const totalLessons = modules.reduce(
    (acc: number, module) => acc + (module.lessons?.length || 0),
    0
  );
  const previewLessons = modules.reduce(
    (acc: number, module) =>
      acc + (module.lessons?.filter((lesson) => lesson.isPreview).length || 0),
    0
  );

  // Calcular rating médio
  const averageRating =
    courseReviews.length > 0
      ? courseReviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
        courseReviews.length
      : 0;

  return (
    <CoursePageClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      course={course as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modules={modules as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      courseReviews={courseReviews as any}
      totalLessons={totalLessons}
      previewLessons={previewLessons}
      averageRating={averageRating}
      hasActiveSubscription={hasActiveSubscription} // Check if user has active subscription
      userProgress={userProgress} // Pass user progress
    />
  );
}
