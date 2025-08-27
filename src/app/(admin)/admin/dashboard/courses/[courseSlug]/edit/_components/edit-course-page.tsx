"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Course as CourseType } from "@/@types/types";
import { Button } from "@/components/ui/button";
import { CourseUpsertForm } from "../../../_components/course-upsert-form";

// Tipos
interface CourseSeries {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  isSequential: boolean;
  _count: { courses: number };
}

interface EditCoursePageProps {
  course: CourseType;
  initialSeries: CourseSeries[];
}

export default function EditCoursePage({
  course,
  initialSeries: _initialSeries,
}: EditCoursePageProps) {
  const router = useRouter();

  const handleCourseUpdated = (_updatedCourse: CourseType) => {
    toast.success("Curso atualizado com sucesso!");
    router.push(`/admin/dashboard/courses/${course.slug}`);
  };

  const handleCancel = () => {
    router.push(`/admin/dashboard/courses/${course.slug}`);
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
          Voltar para o Curso
        </Button>
      </div>

      {/* Formulário de edição */}
      <div className="rounded-lg border bg-card">
        <CourseUpsertForm
          mode="edit"
          initialCourse={course}
          onSuccess={handleCourseUpdated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
