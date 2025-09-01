"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, GripVertical } from "lucide-react";
import { QuizQuestion } from "../../_components/types";

interface QuestionListProps {
  questions: QuizQuestion[];
  onEditQuestion: (question: QuizQuestion) => void;
}

export default function QuestionList({
  questions,
  onEditQuestion,
}: QuestionListProps) {
  const getQuestionTypeLabel = (type: string) => {
    const types = {
      MULTIPLE_CHOICE: "Múltipla Escolha",
      MULTIPLE_SELECT: "Múltipla Seleção",
      TRUE_FALSE: "Verdadeiro/Falso",
      SHORT_ANSWER: "Resposta Curta",
      ESSAY: "Dissertativa",
      CODE: "Código",
      ORDERING: "Ordenação",
    };
    return types[type as keyof typeof types] || type;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "TRUE_FALSE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "SHORT_ANSWER":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "ESSAY":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderQuestionContent = (question: QuizQuestion) => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
      case "MULTIPLE_SELECT":
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">Opções:</div>
            <div className="space-y-1">
              {question.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded border flex items-center justify-center text-xs">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {question.correctAnswers?.includes(option) && (
                    <Badge variant="secondary" className="text-xs">
                      Correta
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">Resposta correta:</div>
            <div className="flex gap-2">
              {question.correctAnswers?.map(
                (answer: string | number, index: number) => (
                  <Badge key={index} variant="secondary">
                    {String(answer) === "true" ? "Verdadeiro" : "Falso"}
                  </Badge>
                )
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Tipo de questão: {getQuestionTypeLabel(question.type)}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question, _index) => (
        <Card key={question.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Handle para arrastar */}
              <div className="flex items-center pt-1">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              </div>

              {/* Conteúdo da questão */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{question.order}
                    </Badge>
                    <Badge className={getQuestionTypeColor(question.type)}>
                      {getQuestionTypeLabel(question.type)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {question.points} ponto{question.points !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditQuestion(question)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">{question.title}</div>
                  {question.explanation && (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      <span className="font-medium">Explicação:</span>{" "}
                      {question.explanation}
                    </div>
                  )}
                  {renderQuestionContent(question)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
