"use client";

import type {
  Lesson,
  LessonNavigationProps,
  Module,
} from "@/@types/course-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

export function LessonNavigation({
  course,
  modules,
  currentModule,
  currentLesson,
}: LessonNavigationProps) {
  // Encontrar lição anterior e próxima
  const findPreviousLesson = () => {
    const currentModuleIndex = modules.findIndex(
      (m) => m.id === currentModule.id
    );
    const currentLessonIndex =
      currentModule.lessons?.findIndex((l) => l.id === currentLesson.id) || 0;

    // Se não é a primeira lição do módulo atual
    if (currentLessonIndex > 0) {
      const prevLesson = currentModule.lessons?.[currentLessonIndex - 1];
      if (prevLesson) {
        return {
          lesson: prevLesson,
          module: currentModule,
        };
      }
    }

    // Buscar na última lição do módulo anterior
    for (let i = currentModuleIndex - 1; i >= 0; i--) {
      const moduleItem = modules[i];
      if (moduleItem.lessons && moduleItem.lessons.length > 0) {
        const lastLesson = moduleItem.lessons[moduleItem.lessons.length - 1];
        return {
          lesson: lastLesson,
          module: moduleItem,
        };
      }
    }

    return null;
  };

  const findNextLesson = () => {
    const currentModuleIndex = modules.findIndex(
      (m) => m.id === currentModule.id
    );
    const currentLessonIndex =
      currentModule.lessons?.findIndex((l) => l.id === currentLesson.id) || 0;

    // Se não é a última lição do módulo atual
    if (currentLessonIndex < (currentModule.lessons?.length || 0) - 1) {
      const nextLesson = currentModule.lessons?.[currentLessonIndex + 1];
      if (nextLesson) {
        return {
          lesson: nextLesson,
          module: currentModule,
        };
      }
    }

    // Buscar na primeira lição do próximo módulo
    for (let i = currentModuleIndex + 1; i < modules.length; i++) {
      const moduleItem = modules[i];
      if (moduleItem.lessons && moduleItem.lessons.length > 0) {
        const firstLesson = moduleItem.lessons[0];
        return {
          lesson: firstLesson,
          module: moduleItem,
        };
      }
    }

    return null;
  };

  const previousLesson = findPreviousLesson();
  const nextLesson = findNextLesson();

  const getLessonUrl = (lesson: Lesson, module: Module) => {
    return `/courses/${course.slug}/learn/${module.slug}/${lesson.slug}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-card/50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Navegação anterior */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {previousLesson ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Link
                    href={getLessonUrl(
                      previousLesson.lesson,
                      previousLesson.module
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">← Anterior</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                  <span className="sm:hidden">← Anterior</span>
                </Button>
              )}
            </div>

            {/* Informações da lição atual */}
            <div className="flex-1 text-center min-w-0 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {currentModule.title}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate max-w-[250px] sm:max-w-none font-medium text-foreground">
                  {currentLesson.title}
                </span>
              </div>
            </div>

            {/* Navegação próxima */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {nextLesson ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Link
                    href={getLessonUrl(nextLesson.lesson, nextLesson.module)}
                  >
                    <span className="hidden sm:inline">Próxima</span>
                    <span className="sm:hidden">Próxima →</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <span className="sm:hidden">Próxima →</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Botões de navegação rápida */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Link href={`/courses/${course.slug}`}>
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Curso</span>
                <span className="sm:hidden">Curso</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Link href={`/courses/${course.slug}/learn`}>
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Currículo</span>
                <span className="sm:hidden">Lista</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Link
                href={`/courses/${course.slug}/learn/${currentModule.slug}`}
              >
                <PlayCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Módulo</span>
                <span className="sm:hidden">Módulo</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
