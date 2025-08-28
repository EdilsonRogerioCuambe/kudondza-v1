"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LessonUpsertForm } from "./lesson-upsert-form";

// Tipos
interface LessonData {
  id: string;
  title: string;
  slug: string | null;
  description?: string;
  shortDescription?: string;
  order: number;
  videoId?: string;
  videoUrl?: string;
  videoDuration?: number;
  transcript?: string;
  isPreview: boolean;
  isRequired: boolean;
  isPublic: boolean;
  unlockCriteria: unknown;
  xpReward: number;
  moduleId: string;
  resources: Array<{
    id: string;
    title: string;
    description: string | null;
    url: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ModuleData {
  id: string;
  title: string;
  slug: string;
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
}

interface EditLessonPageProps {
  lesson: LessonData;
  module: ModuleData;
  course: CourseData;
}

export default function EditLessonPage({
  lesson,
  module,
  course,
}: EditLessonPageProps) {
  const router = useRouter();

  const handleLessonUpdated = (_updatedLesson: LessonData) => {
    toast.success("Aula atualizada com sucesso!");
    router.push(
      `/admin/dashboard/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}`
    );
  };

  const handleCancel = () => {
    router.push(
      `/admin/dashboard/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Botão de voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a Aula
        </Button>
      </div>

      {/* Formulário de edição */}
      <div className="rounded-lg border bg-card">
        <LessonUpsertForm
          mode="edit"
          initialLesson={lesson}
          onSuccess={handleLessonUpdated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
