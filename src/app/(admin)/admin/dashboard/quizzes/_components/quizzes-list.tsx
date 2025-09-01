"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuizFilters from "./quiz-filters";
import QuizStats from "./quiz-stats";
import { QuizUpsertForm } from "./quiz-upsert-form";
import QuizzesTable from "./quizzes-table";
import type {
  AdminQuizListItem,
  QuizFilters as QuizFiltersType,
} from "./types";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface QuizzesListProps {
  initialQuizzes: AdminQuizListItem[];
  initialPagination: PaginationData | null;
  searchParams: {
    search?: string;
    page?: string;
    moduleId?: string;
    courseId?: string;
  };
}

export default function QuizzesList({
  initialQuizzes,
  initialPagination,
  searchParams,
}: QuizzesListProps) {
  const [quizzes, setQuizzes] = useState<AdminQuizListItem[]>(initialQuizzes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  // Função para filtrar quizzes
  const handleFiltersChange = useCallback(
    (filters: QuizFiltersType) => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.moduleId && filters.moduleId !== "all")
        params.set("moduleId", filters.moduleId);
      if (filters.courseId && filters.courseId !== "all")
        params.set("courseId", filters.courseId);

      router.push(`/admin/dashboard/quizzes?${params.toString()}`);
    },
    [router]
  );

  // Função para abrir diálogo de criação
  const handleCreateQuiz = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  // Função para fechar diálogo de criação
  const handleCloseCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  // Função para adicionar novo quiz à lista
  const handleQuizCreated = useCallback((newQuiz: AdminQuizListItem) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
    setIsCreateDialogOpen(false);
  }, []);

  // Função para remover quiz da lista
  const handleQuizRemoved = useCallback((quizId: string) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
  }, []);

  // Calcular estatísticas
  const stats = {
    totalQuizzes: quizzes.length,
    totalQuestions: quizzes.reduce(
      (sum, quiz) => sum + quiz._count.questions,
      0
    ),
    totalAttempts: quizzes.reduce((sum, quiz) => sum + quiz._count.attempts, 0),
    averageScore: 0, // Seria calculado com dados reais
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <QuizStats stats={stats} />

      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <QuizFilters
          initialFilters={{
            search: searchParams.search || "",
            moduleId: searchParams.moduleId || "all",
            courseId: searchParams.courseId || "all",
          }}
          onFiltersChange={handleFiltersChange}
        />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateQuiz} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Criar Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Quiz</DialogTitle>
              <DialogDescription>
                Crie um novo quiz para avaliar o conhecimento dos alunos.
              </DialogDescription>
            </DialogHeader>
            <QuizUpsertForm
              onSuccess={handleQuizCreated}
              onCancel={handleCloseCreateDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Quizzes */}
      <QuizzesTable quizzes={quizzes} onQuizRemoved={handleQuizRemoved} />

      {/* Paginação */}
      {initialPagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {quizzes.length} de {initialPagination.total} quizzes
          </p>
          <div className="flex gap-2">
            {initialPagination.hasPrev && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(
                    searchParams as Record<string, string>
                  );
                  params.set("page", String(initialPagination.page - 1));
                  router.push(`/admin/dashboard/quizzes?${params.toString()}`);
                }}
              >
                Anterior
              </Button>
            )}
            {initialPagination.hasNext && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(
                    searchParams as Record<string, string>
                  );
                  params.set("page", String(initialPagination.page + 1));
                  router.push(`/admin/dashboard/quizzes?${params.toString()}`);
                }}
              >
                Próximo
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
