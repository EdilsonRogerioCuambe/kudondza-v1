"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconX } from "@tabler/icons-react";

interface ReviewFiltersProps {
  filters: {
    search: string;
    rating: string;
    isVerified: string;
    isPublic: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export function ReviewFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalResults,
}: ReviewFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== "" &&
      value !== "all" &&
      value !== "createdAt" &&
      value !== "desc"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filtros</h3>
        <div className="text-sm text-muted-foreground">
          {totalResults} resultado{totalResults !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por título, comentário..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating">Avaliação</Label>
          <Select
            value={filters.rating}
            onValueChange={(value) => onFilterChange("rating", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as avaliações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as avaliações</SelectItem>
              <SelectItem value="5">5 estrelas</SelectItem>
              <SelectItem value="4">4 estrelas</SelectItem>
              <SelectItem value="3">3 estrelas</SelectItem>
              <SelectItem value="2">2 estrelas</SelectItem>
              <SelectItem value="1">1 estrela</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verificação */}
        <div className="space-y-2">
          <Label htmlFor="isVerified">Verificação</Label>
          <Select
            value={filters.isVerified}
            onValueChange={(value) => onFilterChange("isVerified", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="true">Verificadas</SelectItem>
              <SelectItem value="false">Não verificadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Publicidade */}
        <div className="space-y-2">
          <Label htmlFor="isPublic">Visibilidade</Label>
          <Select
            value={filters.isPublic}
            onValueChange={(value) => onFilterChange("isPublic", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="true">Públicas</SelectItem>
              <SelectItem value="false">Privadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ordenação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sortBy">Ordenar por</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFilterChange("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Data de criação</SelectItem>
              <SelectItem value="rating">Avaliação</SelectItem>
              <SelectItem value="updatedAt">Data de atualização</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">Ordem</Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value) => onFilterChange("sortOrder", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Decrescente</SelectItem>
              <SelectItem value="asc">Crescente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className="flex items-center gap-2"
        >
          <IconX className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
