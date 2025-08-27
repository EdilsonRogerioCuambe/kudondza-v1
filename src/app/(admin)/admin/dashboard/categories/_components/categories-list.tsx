"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Category } from "@/@types/types";
import { deleteCategory, getCategories } from "@/actions/categories";
import { Edit, Filter, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { CategoryUpsertForm } from "./category-upsert-form";

export function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const filters = {
        sortBy: "sortOrder" as const,
        sortOrder: "asc" as const,
        page: 1,
        limit: 20,
        ...(search && { search }),
        ...(statusFilter !== "all" && { isActive: statusFilter === "active" }),
      };

      if (search) filters.search = search;
      if (statusFilter !== "all") {
        filters.isActive = statusFilter === "active";
      }

      const result = await getCategories(filters);

      if (result.success && result.data) {
        // Transform null values to undefined to match Category type
        const transformedCategories = result.data.categories.map((cat) => ({
          ...cat,
          description: cat.description ?? undefined,
          icon: cat.icon ?? undefined,
          color: cat.color ?? undefined,
          image: cat.image ?? undefined,
          seoTitle: cat.seoTitle ?? undefined,
          seoDescription: cat.seoDescription ?? undefined,
          seoKeywords: cat.seoKeywords ?? [],
          parentId: cat.parentId ?? undefined,
          parent: cat.parent ?? undefined,
        }));
        setCategories(transformedCategories as unknown as Category[]);
      } else {
        toast.error(result.error || "Erro ao carregar categorias");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  // Debounce search input -> search
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const handleDelete = async (categoryId: string) => {
    try {
      const result = await deleteCategory(categoryId);

      if (result.success) {
        toast.success("Categoria deletada com sucesso");
        loadCategories();
      } else {
        toast.error(result.error || "Erro ao deletar categoria");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar categoria");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSuccess = () => {
    setEditingCategory(null);
    loadCategories();
  };

  const handleCancel = () => {
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40 hidden sm:block" />
            <Skeleton className="h-10 w-full sm:hidden" />
          </div>
          {/* Tabela */}
          <div className="rounded-md border overflow-hidden">
            <div className="divide-y">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 p-4">
                  <Skeleton className="h-4 col-span-2" />
                  <Skeleton className="h-4 hidden md:block" />
                  <Skeleton className="h-4 justify-self-end w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>
                {categories.length} categoria
                {categories.length !== 1 ? "s" : ""} encontrada
                {categories.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {/* Filtros Responsivos */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categorias..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Desktop Filter */}
            <div className="hidden sm:block">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filter */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:hidden w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[300px]">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>
                    Aplique filtros para encontrar categorias específicas
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4 px-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativas</SelectItem>
                        <SelectItem value="inactive">Inativas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Tabela Responsiva */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px] sm:w-[300px]">
                    Categoria
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Cursos</TableHead>
                  <TableHead className="hidden xl:table-cell">Ordem</TableHead>
                  <TableHead className="text-right w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhuma categoria encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {category.icon && (
                            <span className="text-lg">{category.icon}</span>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {category.name}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {category.slug}
                            </div>
                            {category.description && (
                              <div className="text-xs text-muted-foreground truncate mt-1">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              category.isActive ? "default" : "secondary"
                            }
                          >
                            {category.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                          {category.isFeatured && (
                            <Badge variant="outline" className="text-xs">
                              Destaque
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">
                          {category.courseCount} curso
                          {category.courseCount !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden xl:table-cell">
                        {category.sortOrder}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Deletar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Deletar categoria?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Tem certeza
                                    que deseja deletar &quot;{category.name}&quot;?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(category.id)}
                                  >
                                    Confirmar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Informações adicionais para mobile */}
          <div className="mt-4 space-y-3 md:hidden">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.icon && (
                      <span className="text-lg">{category.icon}</span>
                    )}
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.slug}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(category.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                  {category.isFeatured && (
                    <Badge variant="outline">Destaque</Badge>
                  )}
                  <Badge variant="outline">
                    {category.courseCount} curso
                    {category.courseCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingCategory && (
        <CategoryUpsertForm
          mode="edit"
          initialCategory={editingCategory}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
