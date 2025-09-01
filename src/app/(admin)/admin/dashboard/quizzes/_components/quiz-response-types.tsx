"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowUpDown,
  CheckCircle,
  Code,
  FileText,
  Hash,
  List,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

export interface QuizResponseType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface QuizResponseTypesProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export default function QuizResponseTypes({
  selectedTypes,
  onTypesChange,
}: QuizResponseTypesProps) {
  // Definir os tipos disponíveis como constante
  const availableTypes = useMemo(
    () => [
      {
        id: "MULTIPLE_CHOICE",
        name: "Múltipla Escolha",
        description: "Uma resposta correta entre várias opções",
        icon: CheckCircle,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      {
        id: "MULTIPLE_SELECT",
        name: "Múltipla Seleção",
        description: "Múltiplas respostas corretas",
        icon: List,
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      {
        id: "TRUE_FALSE",
        name: "Verdadeiro/Falso",
        description: "Questões binárias simples",
        icon: XCircle,
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
      {
        id: "SHORT_ANSWER",
        name: "Resposta Curta",
        description: "Respostas textuais breves",
        icon: Hash,
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      {
        id: "ESSAY",
        name: "Dissertativa",
        description: "Respostas longas e detalhadas",
        icon: FileText,
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      },
      {
        id: "CODE",
        name: "Código",
        description: "Questões relacionadas a programação",
        icon: Code,
        color:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      },
      {
        id: "ORDERING",
        name: "Ordenação",
        description: "Sequenciamento de itens",
        icon: ArrowUpDown,
        color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      },
    ],
    []
  );

  const handleTypeToggle = (typeId: string, enabled: boolean) => {
    if (enabled) {
      if (!selectedTypes.includes(typeId)) {
        onTypesChange([...selectedTypes, typeId]);
      }
    } else {
      onTypesChange(selectedTypes.filter((id) => id !== typeId));
    }
  };

  const getSelectedCount = () => selectedTypes.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tipos de Resposta do Quiz</span>
          <Badge variant="secondary">
            {getSelectedCount()} tipo{getSelectedCount() !== 1 ? "s" : ""}{" "}
            selecionado{getSelectedCount() !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione quais tipos de questões este quiz pode conter. Você pode
            alterar isso posteriormente.
          </p>

          <div className="grid gap-3">
            {availableTypes.map((type) => {
              const isEnabled = selectedTypes.includes(type.id);
              return (
                <div
                  key={type.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isEnabled
                      ? "border-primary/20 bg-primary/5"
                      : "border-muted bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${type.color}`}>
                      <type.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id={`type-${type.id}`}
                      checked={isEnabled}
                      onCheckedChange={(enabled) =>
                        handleTypeToggle(type.id, enabled)
                      }
                    />
                    <Label htmlFor={`type-${type.id}`} className="sr-only">
                      {type.name}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>

          {getSelectedCount() === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Selecione pelo menos um tipo de resposta para continuar
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
