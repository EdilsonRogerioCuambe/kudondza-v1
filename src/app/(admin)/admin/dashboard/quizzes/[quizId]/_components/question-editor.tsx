"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createQuestion,
  updateQuestion,
  type CreateQuestionInput,
} from "@/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QuizQuestion } from "../../_components/types";

const QuestionFormInputSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  type: z.enum([
    "MULTIPLE_CHOICE",
    "MULTIPLE_SELECT",
    "TRUE_FALSE",
    "SHORT_ANSWER",
    "ESSAY",
    "CODE",
    "ORDERING",
  ]),
  explanation: z.string().optional(),
  points: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswers: z.array(z.union([z.string(), z.number()])).optional(),
});

type QuestionFormInput = z.infer<typeof QuestionFormInputSchema>;

interface QuestionEditorProps {
  quizId: string;
  question?: QuizQuestion;
  onSave: () => void;
  onCancel: () => void;
}

export function QuestionEditor({
  quizId,
  question,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>(question?.options || []);
  const [correctAnswers, setCorrectAnswers] = useState<(string | number)[]>(
    question?.correctAnswers || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<QuestionFormInput>({
    resolver: zodResolver(QuestionFormInputSchema),
    defaultValues: {
      title: question?.title || "",
      type: question?.type || "MULTIPLE_CHOICE",
      explanation: question?.explanation || "",
      points: question?.points?.toString() || "1",
      options: question?.options || [],
      correctAnswers: question?.correctAnswers || [],
    },
  });

  const watchedType = watch("type");

  useEffect(() => {
    // Reset options and correct answers when type changes
    if (watchedType === "TRUE_FALSE") {
      setOptions([]);
      setCorrectAnswers([]);
    } else if (["MULTIPLE_CHOICE", "MULTIPLE_SELECT"].includes(watchedType)) {
      if (options.length === 0) {
        setOptions(["", ""]);
      }
    }
  }, [watchedType, options.length]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // Remove correct answers that are no longer valid
    const newCorrectAnswers = correctAnswers.filter((answer) =>
      newOptions.includes(answer.toString())
    );
    setCorrectAnswers(newCorrectAnswers);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    // Update correct answers if needed
    const oldValue = options[index];
    if (correctAnswers.includes(oldValue)) {
      const newCorrectAnswers = correctAnswers.map((answer) =>
        answer === oldValue ? value : answer
      );
      setCorrectAnswers(newCorrectAnswers);
    }
  };

  const toggleCorrectAnswer = (option: string) => {
    if (watchedType === "MULTIPLE_CHOICE") {
      // Only one correct answer for multiple choice
      setCorrectAnswers([option]);
    } else if (watchedType === "MULTIPLE_SELECT") {
      // Multiple correct answers for multiple select
      if (correctAnswers.includes(option)) {
        setCorrectAnswers(correctAnswers.filter((answer) => answer !== option));
      } else {
        setCorrectAnswers([...correctAnswers, option]);
      }
    } else if (watchedType === "TRUE_FALSE") {
      // For true/false, toggle between true and false
      setCorrectAnswers(correctAnswers.includes(option) ? [] : [option]);
    }
  };

  const onSubmit = async (data: QuestionFormInput) => {
    setIsLoading(true);
    try {
      // Convert input data to output format
      const questionData = {
        ...data,
        points: parseInt(data.points) || 1,
        quizId,
        options:
          watchedType === "TRUE_FALSE"
            ? []
            : options.filter((opt) => opt.trim() !== ""),
        correctAnswers,
      };

      let result;
      if (question) {
        result = await updateQuestion({
          id: question.id,
          ...questionData,
        });
      } else {
        result = await createQuestion(questionData as CreateQuestionInput);
      }

      if (result.success) {
        toast.success(
          question
            ? "Questão atualizada com sucesso!"
            : "Questão criada com sucesso!"
        );
        onSave();
      } else {
        toast.error(result.error || "Erro ao salvar questão");
      }
    } catch (error) {
      toast.error("Erro interno do servidor");
      console.log("Erro ao salvar questão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOptionsSection = () => {
    if (watchedType === "TRUE_FALSE") {
      return (
        <div className="space-y-2">
          <Label>Resposta correta</Label>
          <div className="flex gap-2">
            {["true", "false"].map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  correctAnswers.includes(option) ? "default" : "outline"
                }
                onClick={() => toggleCorrectAnswer(option)}
                className="flex-1"
              >
                {option === "true" ? "Verdadeiro" : "Falso"}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    if (["MULTIPLE_CHOICE", "MULTIPLE_SELECT"].includes(watchedType)) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Opções</Label>
            <Button
              type="button"
              onClick={addOption}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Opção
            </Button>
          </div>

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Opção ${String.fromCharCode(65 + index)}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant={
                    correctAnswers.includes(option) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleCorrectAnswer(option)}
                  disabled={option.trim() === ""}
                >
                  {watchedType === "MULTIPLE_CHOICE" ? "Correta" : "Selecionar"}
                </Button>
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {options.length < 2 && (
            <p className="text-sm text-muted-foreground">
              Adicione pelo menos 2 opções
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{question ? "Editar Questão" : "Nova Questão"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tipo de questão */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Questão *</Label>
            <Select
              value={watchedType}
              onValueChange={(value) =>
                setValue("type", value as QuestionFormInput["type"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MULTIPLE_CHOICE">
                  Múltipla Escolha
                </SelectItem>
                <SelectItem value="MULTIPLE_SELECT">
                  Múltipla Seleção
                </SelectItem>
                <SelectItem value="TRUE_FALSE">Verdadeiro/Falso</SelectItem>
                <SelectItem value="SHORT_ANSWER">Resposta Curta</SelectItem>
                <SelectItem value="ESSAY">Dissertativa</SelectItem>
                <SelectItem value="CODE">Código</SelectItem>
                <SelectItem value="ORDERING">Ordenação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Questão *</Label>
            <Textarea
              id="title"
              {...register("title")}
              placeholder="Digite a pergunta..."
              rows={3}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Explicação */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explicação (opcional)</Label>
            <Textarea
              id="explanation"
              {...register("explanation")}
              placeholder="Explicação da resposta correta..."
              rows={2}
            />
          </div>

          {/* Pontos */}
          <div className="space-y-2">
            <Label htmlFor="points">Pontos</Label>
            <Input
              id="points"
              type="number"
              min="1"
              {...register("points")}
              className="w-24"
            />
          </div>

          {/* Opções baseadas no tipo */}
          {renderOptionsSection()}

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {question ? "Atualizar" : "Criar"} Questão
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
