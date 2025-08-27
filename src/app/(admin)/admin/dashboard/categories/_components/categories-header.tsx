"use client";

import { Plus, FolderOpen } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CategoryUpsertForm } from "./category-upsert-form";

export function CategoriesHeader() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSuccess = () => {
    setShowCreateForm(false);
    // Recarregar a lista de categorias
    window.location.reload();
  };

  const handleCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-6 w-6" />
              <div>
                <CardTitle>Gerenciar Categorias</CardTitle>
                <CardDescription>
                  Crie e gerencie as categorias dos cursos
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            As categorias ajudam a organizar os cursos de forma hierárquica.
            Você pode criar categorias principais e subcategorias para uma melhor organização.
          </div>
        </CardContent>
      </Card>

      {showCreateForm && (
        <CategoryUpsertForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
