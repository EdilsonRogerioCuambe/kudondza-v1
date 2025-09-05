"use client";

import { Save, XCircle } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface EditFormProps {
  title: string;
  subtitle?: string;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  tabs?: Array<{
    value: string;
    label: string;
    content: ReactNode;
  }>;
  className?: string;
}

export function EditForm({
  title,
  subtitle,
  onSubmit,
  onCancel,
  loading = false,
  disabled = false,
  children,
  tabs,
  className,
}: EditFormProps) {
  return (
    <div className={`space-y-4 md:space-y-6 ${className || ""}`}>
      {/* Header do formulário */}
      <div className="border-b px-3 md:px-6 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center gap-2"
              size="sm"
            >
              <XCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Cancelar</span>
              <span className="sm:hidden">Cancelar</span>
            </Button>
            <Button
              onClick={onSubmit}
              disabled={disabled || loading}
              className="flex-1 sm:flex-none flex items-center gap-2"
              size="sm"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {loading ? "Salvando..." : "Salvar"}
              </span>
              <span className="sm:hidden">{loading ? "..." : "Salvar"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo do formulário */}
      <div className="px-3 md:px-6 pb-4 md:pb-6">
        {tabs ? (
          <Tabs defaultValue={tabs[0]?.value} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs md:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="space-y-4 md:space-y-6 mt-4 md:mt-6"
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
