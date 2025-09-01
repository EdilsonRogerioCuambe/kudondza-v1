"use client";

import {
  Archive,
  Brain,
  Clock,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Target,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteQuiz } from "@/actions/quizzes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminQuizListItem } from "./types";

export default function QuizzesTable({
  quizzes,
  onQuizRemoved,
}: {
  quizzes: AdminQuizListItem[];
  onQuizRemoved: (quizId: string) => void;
}) {
  const router = useRouter();
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewQuiz = (quizId: string) => {
    router.push(`/admin/dashboard/quizzes/${quizId}`);
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/admin/dashboard/quizzes/${quizId}/edit`);
  };

  const handleDuplicateQuiz = (_quiz: AdminQuizListItem) => {
    // Implementar duplicação
    toast.info("Funcionalidade de duplicação em desenvolvimento");
  };

  const handleArchiveQuiz = (_quiz: AdminQuizListItem) => {
    // Implementar arquivamento
    toast.info("Funcionalidade de arquivamento em desenvolvimento");
  };

  const handleDeleteQuiz = async (quizId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteQuiz(quizId);

      if (result.success) {
        toast.success("Quiz deletado com sucesso!");
        onQuizRemoved(quizId);
      } else {
        toast.error(result.error || "Erro ao deletar quiz");
      }
    } catch (error) {
      toast.error("Erro interno do servidor");
      console.log("Erro ao deletar quiz:", error);
    } finally {
      setIsDeleting(false);
      setQuizToDelete(null);
    }
  };

  const formatTimeLimit = (timeLimit?: number | null) => {
    if (!timeLimit) return "Sem limite";
    return `${timeLimit} min`;
  };

  const getQuizStatus = (quiz: AdminQuizListItem) => {
    if (quiz._count.questions === 0) {
      return {
        text: "Sem questões",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
    }
    if (quiz._count.questions < 3) {
      return {
        text: "Poucas questões",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      };
    }
    return {
      text: "Pronto",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
  };

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum quiz encontrado</h3>
        <p className="mt-2 text-muted-foreground">
          Comece criando seu primeiro quiz para avaliar o conhecimento dos
          alunos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz</TableHead>
              <TableHead>Módulo/Curso</TableHead>
              <TableHead>Configurações</TableHead>
              <TableHead>Estatísticas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              return (
                <TableRow key={quiz.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{quiz.title}</div>
                      {quiz.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {quiz.description}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Ordem: {quiz.order}</span>
                        <span>•</span>
                        <span>XP: {quiz.xpReward}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{quiz.module.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {quiz.module.course.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quiz.module.course.category.name}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeLimit(quiz.timeLimit)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3" />
                        <span>{quiz.passingScore}% para aprovação</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>Máx: {quiz.maxAttempts} tentativas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-3 w-3" />
                        <span>
                          {quiz.shuffleQuestions ? "Embaralhar" : "Ordem fixa"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3" />
                        <span>{quiz._count.questions} questões</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-3 w-3" />
                        <span>{quiz._count.attempts} tentativas</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={status.color}>{status.text}</Badge>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewQuiz(quiz.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditQuiz(quiz.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDuplicateQuiz(quiz)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleArchiveQuiz(quiz)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Arquivar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setQuizToDelete(quiz.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={!!quizToDelete}
        onOpenChange={() => setQuizToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este quiz? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => quizToDelete && handleDeleteQuiz(quizToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
