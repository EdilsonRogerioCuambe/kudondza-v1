"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createQuiz, type CreateQuizInput } from "@/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import CourseModuleSelector from "./course-module-selector";
import QuizResponseTypes from "./quiz-response-types";
import type { AdminQuizListItem } from "./types";

const QuizFormInputSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  courseId: z.string().optional(),
  moduleId: z.string().optional(),
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

type QuizFormInput = z.infer<typeof QuizFormInputSchema>;

interface QuizUpsertFormProps {
  quiz?: AdminQuizListItem;
  onSuccess: (quiz: AdminQuizListItem) => void;
  onCancel: () => void;
}

export function QuizUpsertForm({
  quiz,
  onSuccess,
  onCancel,
}: QuizUpsertFormProps) {
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
  } = useForm<QuizFormInput>({
    resolver: zodResolver(QuizFormInputSchema),
    defaultValues: {
      title: quiz?.title || "",
      description: quiz?.description || "",
      courseId: "",
      moduleId: "",
      timeLimit: quiz?.timeLimit?.toString() || "",
      passingScore: quiz?.passingScore?.toString() || "70",
      maxAttempts: quiz?.maxAttempts?.toString() || "3",
      shuffleQuestions: quiz?.shuffleQuestions ?? true,
      showResults: quiz?.showResults ?? true,
      xpReward: quiz?.xpReward?.toString() || "100",
      allowedQuestionTypes: [
        "MULTIPLE_CHOICE",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
      ],
    },
  });

  const watchedValues = watch();

  // Atualizar valores do formulário quando curso/módulo mudar
  const handleCourseChange = useCallback(
    (courseId: string) => {
      setSelectedCourseId(courseId);
      setValue("courseId", courseId);
    },
    [setValue]
  );

  const handleModuleChange = useCallback(
    (moduleId: string) => {
      setSelectedModuleId(moduleId);
      setValue("moduleId", moduleId);
    },
    [setValue]
  );

  const handleQuestionTypesChange = useCallback(
    (types: string[]) => {
      setAllowedQuestionTypes(types);
      setValue("allowedQuestionTypes", types);
    },
    [setValue]
  );

  const onSubmit = async (data: QuizFormInput) => {
    // Validar se curso e módulo foram selecionados
    if (!selectedCourseId || !selectedModuleId) {
      toast.error("Por favor, selecione um curso e um módulo");
      return;
    }

    setIsLoading(true);
    try {
      // Convert input data to output format and add required fields
      const quizData = {
        ...data,
        courseId: selectedCourseId,
        moduleId: selectedModuleId,
        timeLimit: data.timeLimit ? parseInt(data.timeLimit) : undefined,
        passingScore: parseInt(data.passingScore) || 70,
        maxAttempts: parseInt(data.maxAttempts) || 3,
        xpReward: parseInt(data.xpReward) || 100,
        allowedQuestionTypes,
      };

      const result = await createQuiz(quizData as CreateQuizInput);

      if (result.success && result.data) {
        toast.success("Quiz criado com sucesso!");
        onSuccess(result.data as AdminQuizListItem);
      } else {
        toast.error(result.error || "Erro ao criar quiz");
      }
    } catch (error) {
      toast.error("Erro interno do servidor");
      console.log("Erro ao criar quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

        {/* Seletor hierárquico de Curso e Módulo */}
        <div className="space-y-2">
          <Label>Localização *</Label>
          <CourseModuleSelector
            selectedCourseId={selectedCourseId}
            selectedModuleId={selectedModuleId}
            onCourseChange={handleCourseChange}
            onModuleChange={handleModuleChange}
          />
          {errors.courseId && (
            <p className="text-sm text-red-500">{errors.courseId.message}</p>
          )}
          {errors.moduleId && (
            <p className="text-sm text-red-500">{errors.moduleId.message}</p>
          )}
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
            <Label htmlFor="passingScore">Pontuação para Aprovação (%)</Label>
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
              onCheckedChange={(checked) => setValue("showResults", checked)}
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
              Criando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Criar Quiz
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}
