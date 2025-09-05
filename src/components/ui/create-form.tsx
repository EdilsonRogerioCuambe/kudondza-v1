"use client";

import { Loader2, Plus } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface CreateFormProps {
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitLabel?: string;
  submitIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CreateForm({
  title,
  subtitle,
  onSubmit,
  children,
  submitLabel = "Adicionar",
  submitIcon = <Plus className="mr-2 h-4 w-4" />,
  loading = false,
  disabled = false,
  className,
}: CreateFormProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-3 space-y-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <Separator className="mt-4" />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={disabled || loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                submitIcon
              )}
              {loading ? "Processando..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardHeader>
    </Card>
  );
}
