"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateQuiz, type UpdateQuizInput } from "@/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import CourseModuleSelector from "../../../_components/course-module-selector";
import QuizResponseTypes from "../../../_components/quiz-response-types";
import { QuizDetail } from "../../../_components/types";

const QuizEditInputSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  timeLimit: z.string().optional(),
  passingScore: z.string(),
  maxAttempts: z.string(),
  shuffleQuestions: z.boolean(),
  showResults: z.boolean(),
  xpReward: z.string(),
  allowedQuestionTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de questão"),
});

type QuizEditInput = z.infer<typeof QuizEditInputSchema>;

interface QuizEditFormProps {
  quiz: QuizDetail; // Tipo específico baseado no schema
}

export function QuizEditForm({ quiz }: QuizEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [allowedQuestionTypes, setAllowedQuestionTypes] = useState<string[]>([
    "MULTIPLE_CHOICE",
    "MULTIPLE_SELECT",
    "TRUE_FALSE",
  ]);

  // Inicializar valores se for edição
  useEffect(() => {
    if (quiz) {
      setSelectedCourseId(quiz.module?.course?.id || "");
      setSelectedModuleId(quiz.module?.id || "");
      setAllowedQuestionTypes(
        quiz.allowedQuestionTypes || [
          "MULTIPLE_CHOICE",
          "MULTIPLE_SELECT",
          "TRUE_FALSE",
        ]
      );
    }
  }, [quiz]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<QuizEditInput>({
    resolver: zodResolver(QuizEditInputSchema),
    defaultValues: {
      title: quiz.title || "",
      description: quiz.description || "",
      timeLimit: quiz.timeLimit?.toString() || "",
      passingScore: quiz.passingScore?.toString() || "70",
      maxAttempts: quiz.maxAttempts?.toString() || "3",
      shuffleQuestions: quiz.shuffleQuestions ?? true,
      showResults: quiz.showResults ?? true,
      xpReward: quiz.xpReward?.toString() || "100",
      allowedQuestionTypes: [
        "MULTIPLE_CHOICE",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
      ],
    },
  });

  const watchedValues = watch();

  // Atualizar valores do formulário quando curso/módulo mudar
  const handleCourseChange = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
  }, []);

  const handleModuleChange = useCallback((moduleId: string) => {
    setSelectedModuleId(moduleId);
  }, []);

  const handleQuestionTypesChange = useCallback(
    (types: string[]) => {
      setAllowedQuestionTypes(types);
      setValue("allowedQuestionTypes", types);
    },
    [setValue]
  );

  const onSubmit = async (data: QuizEditInput) => {
    setIsLoading(true);
    try {
      // Convert input data to output format
      const result = await updateQuiz({
        id: quiz.id,
        ...data,
        timeLimit: data.timeLimit ? parseInt(data.timeLimit) : undefined,
        passingScore: parseInt(data.passingScore) || 70,
        maxAttempts: parseInt(data.maxAttempts) || 3,
        xpReward: parseInt(data.xpReward) || 100,
        allowedQuestionTypes,
      } as UpdateQuizInput);

      if (result.success) {
        toast.success("Quiz atualizado com sucesso!");
        router.push(`/admin/dashboard/quizzes/${quiz.id}`);
      } else {
        toast.error(result.error || "Erro ao atualizar quiz");
      }
    } catch (error) {
      toast.error("Erro interno do servidor");
      console.log("Erro ao atualizar quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/dashboard/quizzes/${quiz.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Botão voltar */}
      <Button variant="outline" onClick={handleCancel} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Ex: Quiz de JavaScript Básico"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Descreva o objetivo e conteúdo do quiz"
                  rows={3}
                />
              </div>

              {/* Seletor hierárquico de Curso e Módulo (somente leitura) */}
              <div className="space-y-2">
                <Label>Localização (não pode ser alterada)</Label>
                <CourseModuleSelector
                  selectedCourseId={selectedCourseId}
                  selectedModuleId={selectedModuleId}
                  onCourseChange={handleCourseChange}
                  onModuleChange={handleModuleChange}
                  disabled={true}
                />
                <p className="text-xs text-muted-foreground">
                  O curso e módulo não podem ser alterados após a criação do
                  quiz
                </p>
              </div>
            </div>

            {/* Tipos de resposta permitidos */}
            <QuizResponseTypes
              selectedTypes={allowedQuestionTypes}
              onTypesChange={handleQuestionTypesChange}
            />
            {errors.allowedQuestionTypes && (
              <p className="text-sm text-red-500">
                {errors.allowedQuestionTypes.message}
              </p>
            )}

            {/* Configurações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configurações</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Limite de Tempo (minutos)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    {...register("timeLimit")}
                    placeholder="Sem limite"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passingScore">
                    Pontuação para Aprovação (%)
                  </Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    {...register("passingScore")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Máximo de Tentativas</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min="1"
                    {...register("maxAttempts")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="xpReward">Recompensa de XP</Label>
                  <Input
                    id="xpReward"
                    type="number"
                    min="0"
                    {...register("xpReward")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shuffleQuestions">Embaralhar Questões</Label>
                  <Switch
                    id="shuffleQuestions"
                    checked={watchedValues.shuffleQuestions}
                    onCheckedChange={(checked) =>
                      setValue("shuffleQuestions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showResults">Mostrar Resultados</Label>
                  <Switch
                    id="showResults"
                    checked={watchedValues.showResults}
                    onCheckedChange={(checked) =>
                      setValue("showResults", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || allowedQuestionTypes.length === 0}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Atualizar Quiz
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
