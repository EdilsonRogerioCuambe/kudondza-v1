"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconFilter, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { NotificationFilters } from "./types";

interface NotificationsFiltersProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: NotificationFilters) => void;
  onClearFilters: () => void;
}

export function NotificationsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: NotificationsFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleFilterChange = (key: keyof NotificationFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilters = () => {
    onClearFilters();
    setOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "createdAt" && value !== "desc"
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <IconFilter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrar Notificações</DialogTitle>
          <DialogDescription>
            Aplique filtros para encontrar notificações específicas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Buscar por título ou mensagem..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={filters.type || ""}
              onValueChange={(value) =>
                handleFilterChange("type", value || undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="INFO">Informação</SelectItem>
                <SelectItem value="SUCCESS">Sucesso</SelectItem>
                <SelectItem value="WARNING">Aviso</SelectItem>
                <SelectItem value="ERROR">Erro</SelectItem>
                <SelectItem value="ACHIEVEMENT">Conquista</SelectItem>
                <SelectItem value="SOCIAL">Social</SelectItem>
                <SelectItem value="SYSTEM">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={
                filters.isRead === undefined ? "" : filters.isRead.toString()
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "isRead",
                  value === "" ? undefined : value === "true"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="false">Não lidas</SelectItem>
                <SelectItem value="true">Lidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sortBy">Ordenar por</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: any) =>
                handleFilterChange("sortBy", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Data de criação</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="type">Tipo</SelectItem>
                <SelectItem value="isRead">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sortOrder">Ordem</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: any) =>
                handleFilterChange("sortOrder", value)
              }
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
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClearFilters}>
            <IconX className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
          <Button onClick={() => setOpen(false)}>Aplicar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
