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
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type Category = {
  id: string;
  name: string;
};

type FiltersBarProps = {
  categories: Category[];
  initialParams: {
    search?: string;
    categoryId?: string;
    level?: string;
    language?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
};

export default function FiltersBar({
  categories,
  initialParams,
}: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialParams.search ?? "");
  const [categoryId, setCategoryId] = useState(
    initialParams.categoryId ?? "all"
  );
  const [level, setLevel] = useState(initialParams.level ?? "all");
  const [language, setLanguage] = useState(initialParams.language ?? "");
  const [sortBy, setSortBy] = useState(initialParams.sortBy ?? "createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    initialParams.sortOrder ?? "desc"
  );

  const onApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, value?: string) => {
      if (value && value.length > 0) params.set(key, value);
      else params.delete(key);
    };

    setOrDelete("search", search);
    setOrDelete("categoryId", categoryId === "all" ? undefined : categoryId);
    setOrDelete("level", level === "all" ? undefined : level);
    setOrDelete("language", language);
    setOrDelete("sortBy", sortBy);
    setOrDelete("sortOrder", sortOrder);
    params.delete("page");

    startTransition(() => {
      router.push(`/courses?${params.toString()}`);
    });
  };

  const onClear = () => {
    startTransition(() => {
      router.push(`/courses`);
    });
  };

  const levelOptions = useMemo(
    () => [
      { value: "all", label: "Todos" },
      { value: "BEGINNER", label: "Iniciante" },
      { value: "INTERMEDIATE", label: "Intermediário" },
      { value: "ADVANCED", label: "Avançado" },
      { value: "EXPERT", label: "Especialista" },
    ],
    []
  );

  const sortOptions = [
    { value: "createdAt", label: "Mais recentes" },
    { value: "title", label: "Título" },
    { value: "price", label: "Preço" },
    { value: "viewCount", label: "Mais vistos" },
    { value: "trendingScore", label: "Tendência" },
  ];

  return (
    <div className="rounded-lg border p-4 md:p-5 space-y-4 bg-background/60">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Pesquisar</Label>
          <Input
            id="search"
            placeholder="Busque por título, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nível</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Idioma</Label>
          <Input
            placeholder="Ex.: pt, en"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Ordem</Label>
          <Select
            value={sortOrder}
            onValueChange={(v: "asc" | "desc") => setSortOrder(v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex items-end gap-3">
          <Button onClick={onApply} disabled={isPending}>
            Aplicar filtros
          </Button>
          <Button variant="outline" onClick={onClear} disabled={isPending}>
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}
