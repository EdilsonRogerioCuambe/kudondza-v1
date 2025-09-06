"use client";

import type {
  CoursePageClientProps,
  Lesson,
  Module,
  ModuleSummary,
} from "@/@types/course-types";
import { CourseFAQ } from "@/components/ui/course-faq";
import { CourseNavigation } from "@/components/ui/course-navigation";
import { CourseStats } from "@/components/ui/course-stats";
import { CourseTestimonials } from "@/components/ui/course-testimonials";
import { ModernCourseCard } from "@/components/ui/modern-course-card";
import { ModernCourseHero } from "@/components/ui/modern-course-hero";
import { ModernCurriculum } from "@/components/ui/modern-curriculum";
import { PreviewModal } from "@/components/ui/preview-modal";
import { Separator } from "@/components/ui/separator";
import { ViewPageLayout } from "@/components/ui/view-page-layout";
import { motion } from "framer-motion";
import { Award, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Adapter function to convert PrismaCourse to Course
function adaptCourseForComponents(
  prismaCourse: CoursePageClientProps["course"]
) {
  return {
    ...prismaCourse,
    price: prismaCourse.price ?? 0,
    currency: prismaCourse.currency ?? "USD",
    level: prismaCourse.level ?? "BEGINNER",
    categoryId: prismaCourse.categoryId ?? "",
    language: prismaCourse.language ?? "pt",
    tags: prismaCourse.tags ?? [],
    isPublic: prismaCourse.isPublic ?? true,
    isPremium: prismaCourse.isPremium ?? false,
    allowDownload: prismaCourse.allowDownload ?? false,
    hasPrerequisites: prismaCourse.hasPrerequisites ?? false,
    status: prismaCourse.status ?? "DRAFT",
    seoKeywords: prismaCourse.seoKeywords ?? [],
    createdAt: prismaCourse.createdAt ?? new Date(),
    updatedAt: prismaCourse.updatedAt ?? new Date(),
    instructorId: prismaCourse.instructorId ?? "",
  };
}

// Adapter function to convert PrismaModule to Module
function adaptModuleForComponents(
  prismaModule: CoursePageClientProps["modules"][0]
) {
  return {
    ...prismaModule,
    isRequired: prismaModule.isRequired ?? false,
    isPublic: prismaModule.isPublic ?? true,
    slug: prismaModule.slug ?? "",
    description: prismaModule.description ?? undefined,
    xpReward: prismaModule.xpReward ?? 100,
    createdAt: prismaModule.createdAt ?? new Date(),
    updatedAt: prismaModule.updatedAt ?? new Date(),
    courseId: prismaModule.courseId ?? "",
  };
}

export function CoursePageClient({
  course,
  modules,
  courseReviews,
  totalLessons,
  previewLessons,
  averageRating,
  hasActiveSubscription = false,
}: CoursePageClientProps) {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleSummary | null>(
    null
  );

  // Adapt course for components
  const adaptedCourse = adaptCourseForComponents(course);

  const handlePreviewLesson = (lesson: Lesson, module: Module) => {
    setSelectedLesson(lesson);
    setSelectedModule({
      id: module.id,
      title: module.title,
      slug: module.slug || "",
    });
    setPreviewModalOpen(true);
  };

  return (
    <>
      {/* Sticky Navigation */}
      <CourseNavigation
        course={adaptedCourse}
        isEnrolled={hasActiveSubscription}
        isCompleted={false} // TODO: Implementar verificação de conclusão
      />

      <ViewPageLayout>
        {/* Hero Section */}
        <ModernCourseHero
          course={adaptedCourse}
          previewLessons={previewLessons}
          totalLessons={totalLessons}
          rating={averageRating}
          reviewCount={courseReviews.length}
          isEnrolled={hasActiveSubscription}
        />

        <Separator className="my-12" />

        {/* About Section */}
        {course.description && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Sobre este curso
            </h2>
            {/<[^>]+>/.test(course.description) ? (
              <div
                className="prose dark:prose-invert max-w-none text-sm sm:text-base lg:text-lg leading-relaxed prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base lg:text-lg leading-relaxed prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {course.description}
                </ReactMarkdown>
              </div>
            )}
          </motion.section>
        )}

        <Separator className="my-12" />

        {/* Curriculum Section */}
        {modules?.length > 0 && (
          <ModernCurriculum
            modules={modules.map((module) => {
              const adaptedModule = adaptModuleForComponents(module);
              return {
                ...adaptedModule,
                lessons:
                  module.lessons?.map((lesson: Lesson) => ({
                    ...lesson,
                    slug: lesson.slug || "",
                    isCompleted: false, // TODO: Implementar verificação de progresso
                    isCurrent: false, // TODO: Implementar verificação de progresso
                  })) || [],
              };
            })}
            courseSlug={course.slug || ""}
            onPreviewLesson={handlePreviewLesson}
          />
        )}

        <Separator className="my-12" />

        {/* Instructor Section */}
        {course.instructor && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Seu instrutor
            </h2>
            <div className="bg-gradient-to-br from-card to-muted/50 border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {course.instructor.image ? (
                  <div className="relative">
                    <Image
                      src={course.instructor.image}
                      alt={course.instructor.name}
                      width={80}
                      height={80}
                      className="rounded-full w-20 h-20 object-cover border-2 border-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {course.instructor.name}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Instrutor especializado
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-full">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                      Certificado
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      {course._count?.enrollments || 0} alunos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        <Separator className="my-12" />

        {/* Course Stats Section */}
        <CourseStats
          totalLessons={totalLessons}
          previewLessons={previewLessons}
          duration={course.duration}
          enrollmentsCount={course._count?.enrollments}
          rating={averageRating}
          reviewCount={courseReviews.length}
          level={course.level || ""}
          isEnrolled={hasActiveSubscription}
          progress={0} // TODO: Implementar progresso do usuário
        />

        <Separator className="my-12" />

        {/* Testimonials Section */}
        <CourseTestimonials />

        <Separator className="my-12" />

        {/* FAQ Section */}
        <CourseFAQ />

        <Separator className="my-12" />

        {/* Related Courses Section */}
        {course.relatedCourses && course.relatedCourses.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Cursos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {course.relatedCourses?.slice(0, 6).map((rel, index: number) =>
                rel.targetCourse ? (
                  <motion.div
                    key={rel.targetCourse.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ModernCourseCard
                      id={rel.targetCourse.id}
                      title={rel.targetCourse.title}
                      slug={rel.targetCourse.slug}
                      thumbnail={rel.targetCourse.thumbnail}
                      level={rel.targetCourse.level}
                      language={course.language || ""}
                      shortDescription={rel.targetCourse.shortDescription}
                      price={Number(rel.targetCourse.price ?? 0)}
                      originalPrice={
                        rel.targetCourse.originalPrice
                          ? Number(rel.targetCourse.originalPrice)
                          : undefined
                      }
                      currency={course.currency || ""}
                      duration={rel.targetCourse.duration}
                      enrollmentsCount={rel.targetCourse._count?.enrollments}
                    />
                  </motion.div>
                ) : null
              )}
            </div>
          </motion.section>
        )}

        {/* Preview Modal */}
        {selectedLesson && selectedModule && (
          <PreviewModal
            isOpen={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            lesson={selectedLesson}
            course={adaptedCourse}
            module={selectedModule}
          />
        )}
      </ViewPageLayout>
    </>
  );
}
