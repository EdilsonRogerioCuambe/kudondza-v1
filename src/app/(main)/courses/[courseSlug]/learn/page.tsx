"use client";

import { getCourseProgress } from "@/actions/progress/get-course-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ViewPageLayout } from "@/components/ui/view-page-layout";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Lock,
  PlayCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  order: number;
  videoDuration?: number;
  isCompleted: boolean;
  isCurrent: boolean;
  xpReward?: number;
  isPreview?: boolean;
  isPublic?: boolean;
}

interface Module {
  id: string;
  title: string;
  slug: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface CourseProgressData {
  course: Course;
  enrollment?: {
    id: string;
    status: string;
    progress: number;
    enrolledAt?: Date;
    completedAt?: Date;
  } | null;
  modules: Module[];
  progress: {
    percentage: number;
    completedLessons: number;
    totalLessons: number;
  };
  nextLesson?: {
    lesson: Lesson;
    module: Module;
  } | null;
  currentLesson?: {
    lesson: Lesson;
    module: Module;
  } | null;
}

export default function LearnPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const [courseData, setCourseData] = useState<CourseProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getCourseProgress(courseSlug);

        if (!result.success) {
          setError(result.error || "Erro ao carregar dados do curso");
          return;
        }

        setCourseData(result.data as CourseProgressData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Erro ao carregar dados do curso");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseSlug]);

  if (loading) {
    return (
      <ViewPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ViewPageLayout>
    );
  }

  if (error || !courseData) {
    return (
      <ViewPageLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold">
            {error || "Curso não encontrado"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {error
              ? "Ocorreu um erro ao carregar os dados do curso."
              : "Verifique o link ou explore outros cursos."}
          </p>
          <Link
            href="/courses"
            className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ver cursos
          </Link>
        </div>
      </ViewPageLayout>
    );
  }

  const {
    course,
    modules,
    progress,
    nextLesson: _nextLesson,
    currentLesson,
  } = courseData;

  return (
    <ViewPageLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
              className="hover:text-primary transition-colors"
            >
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Aprender</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground mt-1">
                Continue sua jornada de aprendizado
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {progress.percentage}%
              </div>
              <div className="text-sm text-muted-foreground">Concluído</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Seu progresso</span>
              <span>
                {progress.completedLessons} de {progress.totalLessons} aulas
                concluídas
              </span>
            </div>
            <Progress value={progress.percentage} className="h-3" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Lesson */}
            {currentLesson && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      Próxima aula
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {currentLesson.module.title}:{" "}
                          {currentLesson.lesson.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {currentLesson.lesson.videoDuration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {Math.round(
                                currentLesson.lesson.videoDuration / 60
                              )}
                              min
                            </span>
                          )}
                          {currentLesson.lesson.xpReward && (
                            <span className="flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              {currentLesson.lesson.xpReward} XP
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="lg" className="w-full" asChild>
                        <Link
                          href={`/courses/${course.slug}/learn/${currentLesson.module.slug}/${currentLesson.lesson.slug}`}
                        >
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Continuar aula
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Modules */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Conteúdo do curso</h2>
              {modules.map((module, moduleIndex) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: moduleIndex * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                            {moduleIndex + 1}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {module.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} aulas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {
                              module.lessons.filter(
                                (lesson) => lesson.isCompleted
                              ).length
                            }{" "}
                            / {module.lessons.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            aulas concluídas
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
                              lesson.isCurrent
                                ? "border-primary bg-primary/5"
                                : lesson.isCompleted
                                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                {lesson.isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : lesson.isCurrent ? (
                                  <PlayCircle className="h-4 w-4 text-primary" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>

                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {moduleIndex + 1}.{lessonIndex + 1}{" "}
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  {lesson.videoDuration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {Math.round(lesson.videoDuration / 60)}min
                                    </span>
                                  )}
                                  {lesson.xpReward && (
                                    <span className="flex items-center gap-1">
                                      <Zap className="h-3 w-3" />
                                      {lesson.xpReward} XP
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Button
                              variant={
                                lesson.isCompleted ? "outline" : "default"
                              }
                              size="sm"
                              asChild
                            >
                              <Link
                                href={`/courses/${course.slug}/learn/${module.slug}/${lesson.slug}`}
                              >
                                {lesson.isCompleted ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Revisar
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="h-4 w-4 mr-1" />
                                    Assistir
                                  </>
                                )}
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {progress.completedLessons}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Aulas concluídas
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">
                        {progress.totalLessons - progress.completedLessons}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Restantes
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso geral</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/courses/${course.slug}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver informações do curso
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/courses/${course.slug}/certificate`}>
                      <Award className="h-4 w-4 mr-2" />
                      Ver certificado
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/courses/${course.slug}/resources`}>
                      <Download className="h-4 w-4 mr-2" />
                      Recursos do curso
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </ViewPageLayout>
  );
}
