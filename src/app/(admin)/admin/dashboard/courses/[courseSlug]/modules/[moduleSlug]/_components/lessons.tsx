/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { BookOpen, Plus, Save } from "lucide-react";
import React from "react";
import SortableLesson from "./sortable-lesson";

import { verticalListSortingStrategy } from "@dnd-kit/sortable";

interface LessonsProps {
  lessons: {
    id: string;
    title: string;
    slug: string;
  }[];
  newLessonTitle: string;
  setNewLessonTitle: (value: string) => void;
  newLessonSlug: string;
  setNewLessonSlug: (value: string) => void;
  onCreateLesson: () => void;
  onDragEnd: (event: any) => void;
  onSaveOrder: () => void;
  ids: string[];
  sensors: any;
  loading: boolean;
  saving: boolean;
  moduleId: string | null;
  openDeleteDialog: (lesson: { id: string; title: string }) => void;
  params: {
    courseSlug: string;
    moduleSlug: string;
  };
  router: any;
}

export default function Lessons({
  lessons,
  newLessonTitle,
  setNewLessonTitle,
  newLessonSlug,
  setNewLessonSlug,
  onCreateLesson,
  onDragEnd,
  onSaveOrder,
  ids,
  sensors,
  loading,
  saving,
  moduleId,
  openDeleteDialog,
  params,
  router
}: LessonsProps) {
  return (
    <>
      <Card className="border-none p-0 w-full shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Adicionar Nova Aula
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">
                Título da Aula
              </label>
              <Input
                placeholder="Digite o título da nova aula"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">
                Slug da Aula
              </label>
              <Input
                placeholder="slug-da-aula"
                value={newLessonSlug}
                onChange={(e) => setNewLessonSlug(e.target.value)}
                className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                Gerado automaticamente do título
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onCreateLesson}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 w-full lg:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Criar Aula
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <Card className="border-2 border-border/50 bg-background/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Lista de Aulas ({lessons.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loading && lessons.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhuma aula cadastrada ainda.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Crie sua primeira aula usando o formulário acima.
              </p>
            </div>
          )}

          {!loading && lessons.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={ids}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {lessons.map((l, idx) => (
                    <SortableLesson
                      key={l.id}
                      id={l.id}
                      index={idx + 1}
                      title={l.title}
                      courseSlug={params.courseSlug}
                      moduleSlug={params.moduleSlug}
                      lessonSlug={l.slug}
                      onDelete={openDeleteDialog}
                      router={router}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {lessons.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex justify-end">
                <Button
                  size="default"
                  onClick={onSaveOrder}
                  disabled={saving || loading || !moduleId}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 w-full lg:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" /> Salvar Ordem das Aulas
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
