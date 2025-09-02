"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  IconBook,
  IconFilter,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";

export default function CoursesPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header com Breadcrumbs Automáticos */}
      <PageHeader
        title="Cursos"
        description="Gerencie todos os cursos da plataforma"
        actions={
          <>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <IconFilter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <IconSearch className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button size="sm" className="w-full sm:w-auto">
              <IconPlus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </>
        }
      />

      {/* Conteúdo da Página */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBook className="h-5 w-5 text-primary" />
              Introdução ao React
            </CardTitle>
            <CardDescription>
              Aprenda os fundamentos do React desde o zero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">Ativo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Alunos:</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Módulos:</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBook className="h-5 w-5 text-primary" />
              TypeScript Avançado
            </CardTitle>
            <CardDescription>
              Domine TypeScript com padrões avançados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-blue-600 font-medium">
                  Em Desenvolvimento
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Alunos:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Módulos:</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBook className="h-5 w-5 text-primary" />
              Next.js 14 Masterclass
            </CardTitle>
            <CardDescription>Aprenda Next.js 14 com App Router</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">Ativo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Alunos:</span>
                <span className="font-medium">2,567</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Módulos:</span>
                <span className="font-medium">15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">75% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">+1,234 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% este mês</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
