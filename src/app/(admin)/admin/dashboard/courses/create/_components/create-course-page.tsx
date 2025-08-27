"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CourseUpsertForm } from "../../_components/course-upsert-form";

export default function CreateCoursePage() {
  const router = useRouter();

  const handleCourseCreated = () => {
    toast.success("Curso criado com sucesso!");
    router.push("/admin/dashboard/courses");
  };

  const handleCancel = () => {
    router.push("/admin/dashboard/courses");
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
          Voltar para Cursos
        </Button>
      </div>

      {/* Formulário de criação */}
      <div className="rounded-lg border bg-card">
        <CourseUpsertForm
          mode="create"
          onSuccess={handleCourseCreated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
