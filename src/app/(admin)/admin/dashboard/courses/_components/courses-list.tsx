"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import type { Course as FullCourse } from "@/@types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CourseFilters from "./course-filters";
import CourseStats from "./course-stats";
import { CourseUpsertForm } from "./course-upsert-form";
import CoursesTable from "./courses-table";
import type { AdminCourseListItem } from "./types";

interface CoursesListProps {
  initialCourses: AdminCourseListItem[];
  initialSeries: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    isSequential: boolean;
    _count: {
      courses: number;
    };
  }[];
}

// Componente principal da lista de cursos
export default function CoursesList({ initialCourses }: CoursesListProps) {
  const [courses, setCourses] = useState<AdminCourseListItem[]>(initialCourses);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Função para filtrar cursos
  const handleFiltersChange = (filters: {
    search: string;
    status: string;
    level: string;
    isPublic: string;
  }) => {
    let filtered = [...initialCourses];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(search) ||
          course.description?.toLowerCase().includes(search) ||
          course.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((course) => course.status === filters.status);
    }

    if (filters.level && filters.level !== "all") {
      filtered = filtered.filter((course) => course.level === filters.level);
    }

    if (filters.isPublic !== "all") {
      filtered = filtered.filter(
        (course) => course.isPublic === (filters.isPublic === "true")
      );
    }

    setCourses(filtered);
  };

  // Função para abrir diálogo de criação
  const handleCreateCourse = () => {
    setIsCreateDialogOpen(true);
  };

  // Função para fechar diálogo de criação
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  // Função para adicionar novo curso à lista
  const handleCourseCreated = (newCourse: FullCourse) => {
    const mapped: AdminCourseListItem = {
      id: newCourse.id,
      title: newCourse.title,
      slug: newCourse.slug,
      description: newCourse.description,
      shortDescription: newCourse.shortDescription,
      thumbnail: newCourse.thumbnail,
      status: newCourse.status,
      level: newCourse.level,
      language: newCourse.language,
      price: newCourse.price,
      originalPrice: newCourse.originalPrice,
      currency: newCourse.currency,
      isPublic: newCourse.isPublic,
      isPremium: newCourse.isPremium,
      isFeatured: false,
      duration: newCourse.duration,
      tags: newCourse.tags || [],
      category: undefined,
      subcategory: undefined,
      instructor: undefined,
      _count: { modules: 0, enrollments: 0, reviews: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCourses((prev) => [mapped, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <CourseStats courses={courses} />

      {/* Filtros e ações */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CourseFilters onFiltersChange={handleFiltersChange} />

        <div className="flex items-center space-x-2">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={handleCreateCourse}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Curso</DialogTitle>
                <DialogDescription>
                  Preencha as informações para criar um novo curso.
                </DialogDescription>
              </DialogHeader>
              <CourseUpsertForm
                mode="create"
                onSuccess={handleCourseCreated}
                onCancel={handleCloseCreateDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cursos ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CoursesTable
            courses={courses}
            onCourseUpdated={(id, data) =>
              setCourses((prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...data } : c))
              )
            }
            onCourseRemoved={(id) =>
              setCourses((prev) => prev.filter((c) => c.id !== id))
            }
          />
        </CardContent>
      </Card>

      {/* Diálogo de edição removido nesta refatoração */}
    </div>
  );
}
