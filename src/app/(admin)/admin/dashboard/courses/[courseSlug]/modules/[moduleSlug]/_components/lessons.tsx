/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateForm } from "@/components/ui/create-form";
import { Input } from "@/components/ui/input";
import { SortableItem } from "@/components/ui/sortable-list";
import { SortableSection } from "@/components/ui/sortable-section";
import React from "react";

type LessonItem = SortableItem & {
  slug: string;
};

interface LessonsProps {
  lessons: LessonItem[];
  newLessonTitle: string;
  setNewLessonTitle: (value: string) => void;
  newLessonSlug: string;
  setNewLessonSlug: (value: string) => void;
  onCreateLesson: () => void;
  onReorder: (lessons: LessonItem[]) => void;
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
  onReorder,
  loading,
  saving,
  moduleId,
  openDeleteDialog,
  params,
}: //  router,
LessonsProps) {
  const getEditLessonUrl = (lesson: LessonItem) => {
    return `/admin/dashboard/courses/${params.courseSlug}/modules/${params.moduleSlug}/lessons/${lesson.slug}/edit`;
  };

  const handleCreateLessonForm = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateLesson();
  };

  return (
    <div className="space-y-6">
      {/* Formulário de criação */}
      <CreateForm
        title="Adicionar Nova Aula"
        subtitle="Crie uma nova aula para este módulo"
        onSubmit={handleCreateLessonForm}
        submitLabel="Criar Aula"
        loading={saving}
        disabled={!moduleId || !newLessonTitle.trim()}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/90">
              Título da Aula
            </label>
            <Input
              placeholder="Digite o título da nova aula"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
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
            />
            <p className="text-xs text-muted-foreground">
              Gerado automaticamente do título
            </p>
          </div>
        </div>
      </CreateForm>

      {/* Lista de aulas */}
      <SortableSection
        title="Lista de Aulas"
        subtitle="Arraste para reordenar as aulas"
        items={lessons}
        onReorder={onReorder}
        editUrl={getEditLessonUrl}
        onDelete={openDeleteDialog}
        loading={loading}
        emptyMessage="Nenhuma aula cadastrada ainda. Crie sua primeira aula usando o formulário acima."
      />
    </div>
  );
}
