"use client";

import {
  ArrowLeft,
  Brain,
  CheckCircle,
  Clock,
  Code,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Shuffle,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuizDetail, QuizQuestion } from "../../_components/types";
import { QuestionEditor } from "./question-editor";
import QuestionList from "./question-list";

interface QuizViewProps {
  quiz: QuizDetail; // Tipo específico baseado no schema
}

export default function QuizView({ quiz }: QuizViewProps) {
  const router = useRouter();
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<
    QuizQuestion | undefined
  >(undefined);

  const handleEditQuiz = () => {
    router.push(`/admin/dashboard/quizzes/${quiz.id}/edit`);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(undefined);
    setShowQuestionEditor(true);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setShowQuestionEditor(true);
  };

  const handleQuestionSaved = () => {
    setShowQuestionEditor(false);
    setEditingQuestion(undefined);
    // Recarregar dados do quiz
    window.location.reload();
  };

  const getQuestionTypeInfo = (type: string) => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return {
          label: "Múltipla Escolha",
          icon: CheckCircle,
          color: "bg-blue-100 text-blue-800",
        };
      case "MULTIPLE_SELECT":
        return {
          label: "Múltipla Seleção",
          icon: Users,
          color: "bg-purple-100 text-purple-800",
        };
      case "TRUE_FALSE":
        return {
          label: "Verdadeiro/Falso",
          icon: Eye,
          color: "bg-green-100 text-green-800",
        };
      case "SHORT_ANSWER":
        return {
          label: "Resposta Curta",
          icon: Brain,
          color: "bg-yellow-100 text-yellow-800",
        };
      case "ESSAY":
        return {
          label: "Dissertativa",
          icon: Brain,
          color: "bg-red-100 text-red-800",
        };
      case "CODE":
        return {
          label: "Código",
          icon: Code,
          color: "bg-indigo-100 text-indigo-800",
        };
      case "ORDERING":
        return {
          label: "Ordenação",
          icon: Shuffle,
          color: "bg-orange-100 text-orange-800",
        };
      default:
        return { label: type, icon: Brain, color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Botão voltar */}
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {/* Informações do Quiz */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Informações do Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">{quiz.title}</h3>
              {quiz.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {quiz.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Módulo:</span>
                <span>{quiz.module.title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Curso:</span>
                <span>{quiz.module.course.title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Categoria:</span>
                <span>{quiz.module.course.category.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tempo Limite</p>
                  <p className="text-xs text-muted-foreground">
                    {quiz.timeLimit ? `${quiz.timeLimit} min` : "Sem limite"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Aprovação</p>
                  <p className="text-xs text-muted-foreground">
                    {quiz.passingScore}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tentativas</p>
                  <p className="text-xs text-muted-foreground">
                    Máx: {quiz.maxAttempts}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">XP</p>
                  <p className="text-xs text-muted-foreground">
                    {quiz.xpReward} pontos
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                <span className="text-sm">
                  {quiz.shuffleQuestions
                    ? "Questões embaralhadas"
                    : "Ordem fixa"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {quiz.showResults ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {quiz.showResults
                    ? "Resultados visíveis"
                    : "Resultados ocultos"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{quiz._count.questions}</div>
              <div className="text-sm text-muted-foreground">Questões</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{quiz._count.attempts}</div>
              <div className="text-sm text-muted-foreground">Tentativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{quiz.order}</div>
              <div className="text-sm text-muted-foreground">Ordem</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{quiz.xpReward}</div>
              <div className="text-sm text-muted-foreground">XP</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Questão Permitidos */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Questão Permitidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quiz.allowedQuestionTypes &&
            quiz.allowedQuestionTypes.length > 0 ? (
              quiz.allowedQuestionTypes.map((type: string) => {
                const typeInfo = getQuestionTypeInfo(type);
                return (
                  <Badge key={type} className={typeInfo.color}>
                    <typeInfo.icon className="mr-1 h-3 w-3" />
                    {typeInfo.label}
                  </Badge>
                );
              })
            ) : (
              <p className="text-muted-foreground">Nenhum tipo definido</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questões */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Questões ({quiz._count.questions})</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleEditQuiz} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar Quiz
            </Button>
            <Button onClick={handleAddQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Questão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quiz.questions && quiz.questions.length > 0 ? (
            <QuestionList
              questions={quiz.questions}
              onEditQuestion={handleEditQuestion}
            />
          ) : (
            <div className="text-center py-8">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma questão</h3>
              <p className="mt-2 text-muted-foreground">
                Adicione questões para tornar este quiz funcional.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor de Questões */}
      {showQuestionEditor && (
        <QuestionEditor
          quizId={quiz.id}
          question={editingQuestion}
          onSave={handleQuestionSaved}
          onCancel={() => setShowQuestionEditor(false)}
        />
      )}
    </div>
  );
}
