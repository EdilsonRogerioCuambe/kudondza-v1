"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { QuizFilters } from "./types";

interface QuizFiltersProps {
  initialFilters: QuizFilters;
  onFiltersChange: (filters: QuizFilters) => void;
}

export default function QuizFilters({
  initialFilters,
  onFiltersChange,
}: QuizFiltersProps) {
  const [filters, setFilters] = useState<QuizFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key: keyof QuizFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      moduleId: "all",
      courseId: "all",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search ||
    (filters.moduleId && filters.moduleId !== "all") ||
    (filters.courseId && filters.courseId !== "all");

  return (
    <div className="w-full space-y-4">
      {/* Filtros básicos sempre visíveis */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar quizzes..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Curso</label>
            <Select
              value={filters.courseId || "all"}
              onValueChange={(value) => handleFilterChange("courseId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {/* Aqui seriam carregados os cursos disponíveis */}
                <SelectItem value="course-1">Curso de JavaScript</SelectItem>
                <SelectItem value="course-2">Curso de React</SelectItem>
                <SelectItem value="course-3">Curso de Node.js</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Módulo</label>
            <Select
              value={filters.moduleId || "all"}
              onValueChange={(value) => handleFilterChange("moduleId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os módulos</SelectItem>
                {/* Aqui seriam carregados os módulos disponíveis */}
                <SelectItem value="module-1">Fundamentos</SelectItem>
                <SelectItem value="module-2">Avançado</SelectItem>
                <SelectItem value="module-3">Projetos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 flex gap-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
