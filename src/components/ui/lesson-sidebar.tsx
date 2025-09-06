"use client";

import type { Lesson, LessonSidebarProps, Module } from "@/@types/course-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Lock,
  PlayCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LessonSidebar({
  course,
  modules,
  currentModule,
  currentLesson,
  courseProgress,
}: LessonSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([
    currentModule.id,
  ]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonUrl = (lesson: Lesson, module: Module) => {
    return `/courses/${course.slug}/learn/${module.slug}/${lesson.slug}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getModuleProgress = (module: Module) => {
    const totalLessons = module.lessons?.length || 0;
    if (totalLessons === 0) return 0;

    // TODO: Implementar busca do progresso real do usuário
    const completedLessons = 0;
    return (completedLessons / totalLessons) * 100;
  };

  const getLessonStatus = (lesson: Lesson) => {
    // TODO: Implementar verificação real do status da lição
    if (lesson.id === currentLesson.id) return "current";
    if (lesson.isPreview) return "preview";
    return "locked";
  };

  const isLessonCompleted = (_lesson: Lesson) => {
    // TODO: Implementar verificação real se a lição foi concluída
    return false;
  };

  const totalLessons = modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );

  const completedLessons = Math.floor((courseProgress / 100) * totalLessons);

  return (
    <div className="space-y-4">
      {/* Informações do curso */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {course.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progresso geral */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso do curso</span>
              <span className="font-medium">{Math.round(courseProgress)}%</span>
            </div>
            <Progress value={courseProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {completedLessons} de {totalLessons} lições
              </span>
              <span>
                {course.duration
                  ? `${Math.floor(course.duration / 60)}h`
                  : "0h"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Estatísticas do curso */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {totalLessons} lições
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {course._count?.enrollments || 0} alunos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de módulos e lições */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Currículo</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {modules.map((module, moduleIndex) => {
              const isExpanded = expandedModules.includes(module.id);
              const moduleProgress = getModuleProgress(module);
              const totalModuleLessons = module.lessons?.length || 0;

              return (
                <div key={module.id} className="border-b last:border-b-0">
                  {/* Cabeçalho do módulo */}
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-medium text-sm truncate">
                          {moduleIndex + 1}. {module.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {totalModuleLessons} lições •{" "}
                          {Math.round(moduleProgress)}% concluído
                        </div>
                      </div>
                    </div>
                  </Button>

                  {/* Lições do módulo */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-muted/30"
                    >
                      {module.lessons?.map((lesson, lessonIndex) => {
                        const _status = getLessonStatus(lesson);
                        const isCurrent = lesson.id === currentLesson.id;
                        const isCompleted = isLessonCompleted(lesson);
                        const isPreview = lesson.isPreview;

                        return (
                          <div
                            key={lesson.id}
                            className={`px-4 py-3 border-b last:border-b-0 ${
                              isCurrent
                                ? "bg-primary/10 border-l-4 border-l-primary"
                                : ""
                            }`}
                          >
                            <Link
                              href={getLessonUrl(lesson, module)}
                              className="block hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : isCurrent ? (
                                    <PlayCircle className="h-4 w-4 text-primary" />
                                  ) : isPreview ? (
                                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium truncate">
                                      {lessonIndex + 1}. {lesson.title}
                                    </span>
                                    {isPreview && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Preview
                                      </Badge>
                                    )}
                                    {lesson.isRequired && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        Obrigatória
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {formatDuration(lesson.videoDuration)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import necessário para o ChevronDown e ChevronRight
import { ChevronDown, ChevronRight } from "lucide-react";
