"use client";

import type { Lesson, ModernCurriculumProps } from "@/@types/course-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  Lock,
  PlayCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ModernCurriculum({
  modules,
  courseSlug,
  isEnrolled,
  onPreviewLesson,
  className,
}: ModernCurriculumProps) {
  const [_expandedModules, setExpandedModules] = useState<string[]>([]);

  const totalLessons = modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );
  const previewLessons = modules.reduce(
    (acc, module) =>
      acc + (module.lessons?.filter((lesson) => lesson.isPreview).length || 0),
    0
  );
  const completedLessons = modules.reduce(
    (acc, module) =>
      acc +
      (module.lessons?.filter((lesson) => lesson.isCompleted).length || 0),
    0
  );

  const _toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const minutes = Math.round(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}min`;
    }
    return `${minutes}min`;
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (lesson.isCurrent) {
      return <PlayCircle className="h-4 w-4 text-primary" />;
    }
    if (lesson.isPreview) {
      return <Eye className="h-4 w-4 text-blue-500" />;
    }
    return <Lock className="h-4 w-4 text-muted-foreground" />;
  };

  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.isCompleted) {
      return "Concluída";
    }
    if (lesson.isCurrent) {
      return "Atual";
    }
    if (lesson.isPreview) {
      return "Preview";
    }
    return "Bloqueada";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Conteúdo do curso
          </h2>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 sm:p-4 text-center border border-primary/20"
            >
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {totalLessons}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Aulas totais
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 sm:p-4 text-center border border-blue-200 dark:border-blue-800"
            >
              <div className="text-xl sm:text-2xl font-bold text-blue-500">
                {previewLessons}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Aulas gratuitas
              </div>
            </motion.div>
            {isEnrolled && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 sm:p-4 text-center border border-green-200 dark:border-green-800"
                >
                  <div className="text-xl sm:text-2xl font-bold text-green-500">
                    {completedLessons}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Concluídas
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 sm:p-4 text-center border border-orange-200 dark:border-orange-800"
                >
                  <div className="text-xl sm:text-2xl font-bold text-orange-500">
                    {Math.round((completedLessons / totalLessons) * 100)}%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Progresso
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Progress Bar Global */}
          {isEnrolled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progresso geral do curso</span>
                <span className="text-muted-foreground">
                  {completedLessons} de {totalLessons} aulas
                </span>
              </div>
              <Progress
                value={(completedLessons / totalLessons) * 100}
                className="h-2"
              />
            </motion.div>
          )}
        </div>

        {/* Módulos */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {modules.map((module, moduleIndex) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: moduleIndex * 0.1 }}
            >
              <AccordionItem
                value={`module-${module.id}`}
                className="border rounded-lg px-4 sm:px-6 py-3 sm:py-4 bg-card/50 hover:bg-card/80 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full pr-2 sm:pr-4 gap-3 sm:gap-0">
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs sm:text-sm flex-shrink-0">
                          {moduleIndex + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-base sm:text-lg break-words leading-tight">
                            {module.title}
                          </div>
                          {module.description && (
                            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words mt-1">
                              {module.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
                          {module.lessons?.length || 0} aulas
                        </div>
                        {module.progress !== undefined && (
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {Math.round(module.progress)}% concluído
                          </div>
                        )}
                      </div>
                      {module.isCompleted && (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: lessonIndex * 0.05,
                        }}
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 sm:p-4 transition-all duration-200 gap-3 sm:gap-0 ${
                          lesson.isCurrent
                            ? "border-primary bg-primary/5 shadow-md"
                            : lesson.isCompleted
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted">
                            {getLessonIcon(lesson)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                              <h4 className="font-medium text-sm sm:text-base break-words leading-tight">
                                {moduleIndex + 1}.{lessonIndex + 1}{" "}
                                {lesson.title}
                              </h4>
                              {lesson.isRequired && (
                                <Badge
                                  variant="outline"
                                  className="text-xs flex-shrink-0"
                                >
                                  Obrigatória
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                              {lesson.videoDuration && (
                                <span className="flex items-center gap-1 whitespace-nowrap">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  {formatDuration(lesson.videoDuration)}
                                </span>
                              )}
                              {lesson.xpReward && (
                                <span className="flex items-center gap-1 whitespace-nowrap">
                                  <Zap className="h-3 w-3 flex-shrink-0" />
                                  {lesson.xpReward} XP
                                </span>
                              )}
                              {lesson.resources &&
                                lesson.resources.length > 0 && (
                                  <span className="flex items-center gap-1 whitespace-nowrap">
                                    <Download className="h-3 w-3 flex-shrink-0" />
                                    {lesson.resources.length} recursos
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto flex-shrink-0">
                          <Badge
                            variant={
                              lesson.isCompleted
                                ? "default"
                                : lesson.isCurrent
                                ? "default"
                                : lesson.isPreview
                                ? "secondary"
                                : "outline"
                            }
                            className={`text-xs whitespace-nowrap ${
                              lesson.isCompleted
                                ? "bg-green-500 text-white"
                                : lesson.isCurrent
                                ? "bg-primary text-white"
                                : lesson.isPreview
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                          >
                            {getLessonStatus(lesson)}
                          </Badge>

                          {lesson.isPreview && onPreviewLesson ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPreviewLesson(lesson, module)}
                              className="text-xs sm:text-sm whitespace-nowrap"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              <span className="hidden sm:inline">Preview</span>
                              <span className="sm:hidden">Ver</span>
                            </Button>
                          ) : lesson.isCompleted ||
                            (isEnrolled && !lesson.isPreview) ? (
                            <Button
                              variant="default"
                              size="sm"
                              asChild
                              className="text-xs sm:text-sm whitespace-nowrap"
                            >
                              <Link
                                href={`/courses/${courseSlug}/learn/${module.slug}/${lesson.slug}`}
                              >
                                {lesson.isCompleted ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                    <span className="hidden sm:inline">
                                      Revisar
                                    </span>
                                    <span className="sm:hidden">Ver</span>
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                    <span className="hidden sm:inline">
                                      Assistir
                                    </span>
                                    <span className="sm:hidden">Play</span>
                                  </>
                                )}
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="text-xs sm:text-sm whitespace-nowrap"
                            >
                              <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              <span className="hidden sm:inline">
                                Bloqueada
                              </span>
                              <span className="sm:hidden">Lock</span>
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
}
