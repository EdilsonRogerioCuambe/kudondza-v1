"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import type { CoursesListFilters } from "./types";

interface Props {
  onFiltersChange: (filters: CoursesListFilters) => void;
}

export default function CourseFilters({ onFiltersChange }: Props) {
  const [filters, setFilters] = useState<CoursesListFilters>({
    search: "",
    status: "all",
    level: "all",
    isPublic: "all",
  });

  const handleFilterChange = (key: keyof CoursesListFilters, value: string) => {
    const newFilters = { ...filters, [key]: value } as CoursesListFilters;
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="DRAFT">Rascunho</SelectItem>
            <SelectItem value="REVIEW">Em Revisão</SelectItem>
            <SelectItem value="PUBLISHED">Publicado</SelectItem>
            <SelectItem value="ARCHIVED">Arquivado</SelectItem>
            <SelectItem value="SUSPENDED">Suspenso</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.level}
          onValueChange={(value) => handleFilterChange("level", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="BEGINNER">Iniciante</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
            <SelectItem value="ADVANCED">Avançado</SelectItem>
            <SelectItem value="EXPERT">Especialista</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isPublic}
          onValueChange={(value) => handleFilterChange("isPublic", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Visibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Público</SelectItem>
            <SelectItem value="false">Privado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
