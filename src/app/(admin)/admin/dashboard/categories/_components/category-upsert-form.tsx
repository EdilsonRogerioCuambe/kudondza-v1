"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Save, SparkleIcon, Trash2, X, XCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { Category, CategoryUpsertFormProps } from "@/@types/types";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "@/actions/categories";
import { createSubcategory } from "@/actions/categories/subcategories/create-subcategory";
import { deleteSubcategory } from "@/actions/categories/subcategories/delete-subcategory";
import { getSubcategories } from "@/actions/categories/subcategories/get-subcategories";
import { updateSubcategory } from "@/actions/categories/subcategories/update-subcategory";
import { CreateCategorySchema } from "@/lib/zod-schema";

function mapCategoryToForm(category: Category) {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    icon: category.icon || "",
    color: category.color || "",
    image: category.image || "",
    isActive: category.isActive,
    isFeatured: category.isFeatured,
    sortOrder: category.sortOrder,
    seoTitle: category.seoTitle || "",
    seoDescription: category.seoDescription || "",
    seoKeywords: category.seoKeywords || [],
    parentId: category.parentId || "none",
  };
}

export function CategoryUpsertForm({
  mode,
  initialCategory,
  onSuccess,
  onCancel,
}: CategoryUpsertFormProps) {
  const [isPending, startTransition] = useTransition();
  const [seoKeywordInput, setSeoKeywordInput] = useState("");
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [subcats, setSubcats] = useState<
    Array<{
      id?: string;
      name: string;
      slug: string;
      sortOrder: number;
      isActive: boolean;
    }>
  >([]);
  const [removedSubcatIds, setRemovedSubcatIds] = useState<string[]>([]);

  // Valores padrão do formulário
  const defaultValues =
    mode === "edit" && initialCategory
      ? mapCategoryToForm(initialCategory)
      : {
          name: "",
          slug: "",
          description: "",
          icon: "",
          color: "",
          image: "",
          isActive: true,
          isFeatured: false,
          sortOrder: 0,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: [],
          parentId: "none",
        };

  const form = useForm({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues,
    mode: "onChange",
  });

  // Carregar categorias disponíveis para parentId
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories({
          sortBy: "name",
          sortOrder: "asc",
          page: 1,
          limit: 100,
          isActive: true,
        });
        if (result.success && result.data) {
          // Filtrar a categoria atual se estiver editando
          const categories = result.data.categories.filter(
            (cat) => cat.id !== initialCategory?.id
          );
          setAvailableCategories(categories as unknown as Category[]);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    loadCategories();
  }, [initialCategory?.id]);

  // Carregar subcategorias existentes quando estiver editando
  useEffect(() => {
    const loadSubcats = async () => {
      if (!initialCategory?.id) return;
      try {
        const result = await getSubcategories(initialCategory.id);
        if (result.success && result.data) {
          const list = result.data
            .filter((sc) => sc.category?.id === initialCategory.id)
            .map((sc) => ({
              id: sc.id as string,
              name: sc.name as string,
              slug: sc.slug as string,
              sortOrder: Number(sc.sortOrder ?? 0),
              isActive: Boolean(sc.isActive ?? true),
            }));
          setSubcats(list);
        }
      } catch (e) {
        console.error("Erro ao carregar subcategorias", e);
      }
    };
    loadSubcats();
  }, [initialCategory?.id]);

  // Função para gerar slug automaticamente
  const handleGenerateSlug = () => {
    const nameValue = form.getValues("name");
    const slug = slugify(nameValue, { lower: true, strict: true });
    form.setValue("slug", slug, { shouldValidate: true });
  };

  const addSubcat = () => {
    setSubcats((prev) => [
      ...prev,
      {
        id: `tmp-${Math.random().toString(36).slice(2)}`,
        name: "",
        slug: "",
        sortOrder: 0,
        isActive: true,
      },
    ]);
  };

  const removeSubcat = (id?: string) => {
    setSubcats((prev) => prev.filter((s) => s.id !== id));
    if (id && !id.startsWith("tmp-"))
      setRemovedSubcatIds((prev) => [...prev, id]);
  };

  const updateSubcatField = (
    id: string | undefined,
    field: keyof Omit<(typeof subcats)[number], "id">,
    value: string | number | boolean
  ) => {
    setSubcats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Função para adicionar palavra-chave SEO
  const handleAddSeoKeyword = () => {
    const keyword = seoKeywordInput.trim();
    if (keyword && !form.getValues("seoKeywords")?.includes(keyword)) {
      const currentKeywords = form.getValues("seoKeywords") || [];
      form.setValue("seoKeywords", [...currentKeywords, keyword]);
      setSeoKeywordInput("");
    }
  };

  // Função para remover palavra-chave SEO
  const handleRemoveSeoKeyword = (keywordToRemove: string) => {
    const currentKeywords = form.getValues("seoKeywords") || [];
    form.setValue(
      "seoKeywords",
      currentKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  // Função para submeter o formulário
  const onSubmit = async (values: z.infer<typeof CreateCategorySchema>) => {
    startTransition(async () => {
      try {
        // Converter "none" para undefined para parentId
        const formData = {
          ...values,
          parentId: values.parentId === "none" ? undefined : values.parentId,
        };

        let result;

        if (mode === "edit" && initialCategory) {
          result = await updateCategory({
            ...formData,
            id: initialCategory.id,
          });
        } else {
          result = await createCategory(formData);
        }

        if (result.success && result.data) {
          toast.success(
            mode === "edit"
              ? "Categoria atualizada com sucesso!"
              : "Categoria criada com sucesso!"
          );

          const categoryData = result.data as unknown as Category;

          // Sincronizar subcategorias
          await Promise.all([
            // criar/atualizar
            ...subcats.map((s) => {
              if (!s.name?.trim() || !s.slug?.trim())
                return Promise.resolve(null);
              if (!s.id || s.id.startsWith("tmp-")) {
                return createSubcategory({
                  name: s.name.trim(),
                  slug: s.slug.trim(),
                  sortOrder: Number(s.sortOrder || 0),
                  isActive: Boolean(s.isActive),
                  categoryId: categoryData.id,
                });
              }
              return updateSubcategory({
                id: s.id,
                name: s.name.trim(),
                slug: s.slug.trim(),
                sortOrder: Number(s.sortOrder || 0),
                isActive: Boolean(s.isActive),
              });
            }),
            // deletar removidas
            ...removedSubcatIds.map((id) => deleteSubcategory(id)),
          ]);

          onSuccess(categoryData);
        } else {
          toast.error(result.error || "Erro ao salvar categoria");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro interno";
        toast.error(message);
      }
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <BookOpen className="h-5 w-5" />
          {mode === "edit" ? "Editar Categoria" : "Nova Categoria"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {mode === "edit"
            ? "Edite as informações da categoria"
            : "Preencha as informações para criar uma nova categoria"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 gap-1 sm:gap-2">
                <TabsTrigger value="basic" className="text-xs sm:text-sm px-2">
                  Básico
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="text-xs sm:text-sm px-2"
                >
                  Aparência
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs sm:text-sm px-2">
                  SEO
                </TabsTrigger>
                <TabsTrigger
                  value="subcats"
                  className="text-xs sm:text-sm px-2"
                >
                  Subcategorias
                </TabsTrigger>
              </TabsList>

              {/* Aba Básico */}
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Programação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="programacao" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateSlug}
                    variant="outline"
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm"
                  >
                    <SparkleIcon className="mr-2 h-4 w-4" />
                    Gerar Slug
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição da categoria..."
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria Pai</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            Nenhuma (Categoria Raiz)
                          </SelectItem>
                          {availableCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordem de Exibição</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                        <div className="space-y-0.5 flex-1">
                          <FormLabel className="text-sm sm:text-base">
                            Categoria Ativa
                          </FormLabel>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Permitir que esta categoria seja exibida
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4">
                        <div className="space-y-0.5 flex-1">
                          <FormLabel className="text-sm sm:text-base">
                            Categoria em Destaque
                          </FormLabel>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Marcar como categoria em destaque
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Aba Subcategorias */}
              <TabsContent value="subcats" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Gerencie as subcategorias desta categoria
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSubcat}
                  >
                    <SparkleIcon className="h-4 w-4 mr-2" /> Adicionar
                  </Button>
                </div>
                <div className="space-y-3">
                  {subcats.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      Nenhuma subcategoria adicionada
                    </div>
                  )}
                  {subcats.map((s) => (
                    <div
                      key={s.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 border rounded-md p-3"
                    >
                      <Input
                        className="sm:col-span-3"
                        placeholder="Nome"
                        value={s.name}
                        onChange={(e) =>
                          updateSubcatField(s.id, "name", e.target.value)
                        }
                      />
                      <div className="sm:col-span-4 flex gap-2">
                        <Input
                          className="flex-1"
                          placeholder="slug"
                          value={s.slug}
                          onChange={(e) =>
                            updateSubcatField(s.id, "slug", e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            updateSubcatField(
                              s.id,
                              "slug",
                              slugify(s.name || "", {
                                lower: true,
                                strict: true,
                              })
                            )
                          }
                        >
                          <SparkleIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        className="sm:col-span-2"
                        type="number"
                        placeholder="Ordem"
                        value={s.sortOrder}
                        onChange={(e) =>
                          updateSubcatField(
                            s.id,
                            "sortOrder",
                            Number(e.target.value)
                          )
                        }
                      />
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <FormLabel className="text-xs">Ativa</FormLabel>
                        <Switch
                          checked={s.isActive}
                          onCheckedChange={(v) =>
                            updateSubcatField(s.id, "isActive", v)
                          }
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => removeSubcat(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Aba Aparência */}
              <TabsContent value="appearance" className="space-y-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 🚀 ou código do ícone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Input
                            type="color"
                            {...field}
                            className="w-16 h-10 sm:w-20 sm:h-10 rounded-md border-2 border-input cursor-pointer"
                          />
                          <Input
                            placeholder="#000000"
                            {...field}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem de Capa</FormLabel>
                      <FormControl>
                        <Input placeholder="URL da imagem de capa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Aba SEO */}
              <TabsContent value="seo" className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título SEO</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Título otimizado para SEO"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição SEO</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição otimizada para SEO (máximo 160 caracteres)"
                          {...field}
                          maxLength={160}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/160 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palavras-chave SEO</FormLabel>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder="Digite uma palavra-chave e pressione Enter"
                            value={seoKeywordInput}
                            onChange={(e) => setSeoKeywordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSeoKeyword();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleAddSeoKeyword}
                            variant="outline"
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm"
                          >
                            Adicionar
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                          {field.value?.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center gap-1 text-xs sm:text-sm break-all"
                            >
                              <span className="truncate max-w-20 sm:max-w-32">
                                {keyword}
                              </span>
                              <X
                                className="h-3 w-3 cursor-pointer flex-shrink-0"
                                onClick={() => handleRemoveSeoKeyword(keyword)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2 text-sm sm:text-base"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto order-1 sm:order-2 px-4 py-2 text-sm sm:text-base"
              >
                <Save className="mr-2 h-4 w-4" />
                {isPending
                  ? mode === "edit"
                    ? "Salvando..."
                    : "Criando..."
                  : mode === "edit"
                  ? "Salvar Alterações"
                  : "Criar Categoria"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
