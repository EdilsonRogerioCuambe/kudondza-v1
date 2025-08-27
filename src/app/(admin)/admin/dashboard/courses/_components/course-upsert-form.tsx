/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, XCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCategories } from "@/actions/categories/get-categories";
import { getSubcategories } from "@/actions/categories/subcategories/get-subcategories";
import { createCourse, updateCourse } from "@/actions/courses";
import type { CreateCourseInput } from "@/lib/zod-schema";
import { CreateCourseSchema } from "@/lib/zod-schema";

import { Course, CourseUpsertFormProps } from "@/@types/types";
import BasicForm from "./form/basic-form";
import ContentForm from "./form/content-form";
import MediaForm from "./form/media-form";
import PrerequisitesForm from "./form/prerequisites-form";
import SeoForm from "./form/seo-form";
import SettingsForm from "./form/settings-form";

function mapCourseToForm(course: Course): CreateCourseInput {
  return {
    title: course.title,
    slug: course.slug,
    description: course.description || "",
    shortDescription: course.shortDescription || "",
    thumbnail: course.thumbnail || "",
    trailer: course.trailer || "",
    courseMaterials: course.courseMaterials || "",
    categoryId: course.categoryId,
    subcategoryId: course.subcategoryId,
    tags: course.tags || [],
    level: course.level,
    language: course.language,
    duration: course.duration,
    price: course.price,
    originalPrice: course.originalPrice,
    currency: course.currency,
    isPublic: course.isPublic,
    isPremium: course.isPremium,
    allowDownload: course.allowDownload,
    hasPrerequisites: course.hasPrerequisites,
    unlockCriteria: course.unlockCriteria,
    seoTitle: course.seoTitle || "",
    seoDescription: course.seoDescription || "",
    seoKeywords: course.seoKeywords || [],
    xpReward: course.xpReward,
    badgeId: course.badgeId || "",
    seriesId: course.seriesId,
  };
}

export function CourseUpsertForm({
  mode,
  initialCourse,
  onSuccess,
  onCancel,
}: CourseUpsertFormProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  // Valores padrão do formulário
  const defaultValues: CreateCourseInput =
    mode === "edit" && initialCourse
      ? mapCourseToForm(initialCourse)
      : {
          title: "",
          slug: "",
          description: "",
          shortDescription: "",
          thumbnail: "",
          trailer: "",
          courseMaterials: "",
          categoryId: "",
          subcategoryId: undefined,
          tags: [],
          level: "BEGINNER",
          language: "pt",
          duration: undefined,
          price: 0,
          originalPrice: undefined,
          currency: "MZN",
          isPublic: false,
          isPremium: false,
          allowDownload: false,
          hasPrerequisites: false,
          unlockCriteria: undefined,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: [],
          xpReward: 500,
          badgeId: "",
          seriesId: undefined,
        };

  const form = useForm({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues,
    mode: "onChange",
  });

  // Observar mudanças na categoria selecionada
  const watchedCategoryId = form.watch("categoryId");

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories({
          isActive: true,
          sortBy: "sortOrder",
          sortOrder: "asc",
          page: 1,
          limit: 100,
        });
        if (result.success && result.data) {
          setCategories(
            result.data.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
            }))
          );
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    loadCategories();
  }, []);

  // Atualizar subcategorias quando a categoria mudar
  useEffect(() => {
    const categoryId = watchedCategoryId;
    setSelectedCategoryId(categoryId);

    if (categoryId) {
      const loadSubcategories = async () => {
        try {
          const result = await getSubcategories(categoryId);
          if (result.success && result.data) {
            setAvailableSubcategories(
              result.data.map((sub: any) => ({
                id: sub.id,
                name: sub.name,
              }))
            );
          }
        } catch (error) {
          console.error("Erro ao carregar subcategorias:", error);
          setAvailableSubcategories([]);
        }
      };

      loadSubcategories();
    } else {
      setAvailableSubcategories([]);
    }
  }, [watchedCategoryId]);

  // Resetar subcategoria quando categoria mudar
  useEffect(() => {
    if (
      mode === "create" ||
      (mode === "edit" &&
        initialCourse &&
        selectedCategoryId !== initialCourse.categoryId)
    ) {
      form.setValue("subcategoryId", undefined);
    }
  }, [selectedCategoryId, form, mode, initialCourse]);

  // Função para submeter o formulário
  const onSubmit = async (values: CreateCourseInput) => {
    startTransition(async () => {
      try {
        let result;

        // Normalizar campos opcionais: converter strings vazias em undefined
        const normalizedValues: CreateCourseInput = {
          ...values,
          thumbnail:
            values.thumbnail && values.thumbnail.trim() !== ""
              ? values.thumbnail
              : undefined,
          trailer:
            values.trailer && values.trailer.trim() !== ""
              ? values.trailer
              : undefined,
          courseMaterials:
            values.courseMaterials && values.courseMaterials.trim() !== ""
              ? values.courseMaterials
              : undefined,
          subcategoryId:
            (values.subcategoryId as unknown as string) &&
            (values.subcategoryId as unknown as string).trim() !== ""
              ? (values.subcategoryId as unknown as string)
              : undefined,
          originalPrice:
            typeof values.originalPrice === "number"
              ? values.originalPrice
              : undefined,
          duration:
            typeof values.duration === "number" ? values.duration : undefined,
          seoTitle:
            values.seoTitle && values.seoTitle.trim() !== ""
              ? values.seoTitle
              : undefined,
          seoDescription:
            values.seoDescription && values.seoDescription.trim() !== ""
              ? values.seoDescription
              : undefined,
        } as CreateCourseInput;

        if (mode === "edit" && initialCourse) {
          result = await updateCourse({
            ...normalizedValues,
            id: initialCourse.id,
          });
        } else {
          result = await createCourse(normalizedValues);
        }

        if (result.success && result.data) {
          toast.success(
            mode === "edit"
              ? "Curso atualizado com sucesso!"
              : "Curso criado com sucesso!"
          );

          // Chamar callback de sucesso
          const courseData = result.data as unknown as Course;
          onSuccess(courseData);
        } else {
          toast.error(result.error || "Erro ao salvar curso");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro interno";
        toast.error(message);
      }
    });
  };

  // exibir no console o que falta preencher no formulário quando tentar submeter
  useEffect(() => {
    if (form.formState.isSubmitted && !form.formState.isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];
      console.log("Campo com erro:", firstErrorField);
      console.log("Erros do formulário:", form.formState.errors);
    }
  }, [form.formState]);

  return (
    <Form {...form}>
      <div className="space-y-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="md:hidden p-6">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar seção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="content">Conteúdo</SelectItem>
                <SelectItem value="media">Mídia</SelectItem>
                <SelectItem value="settings">Configurações</SelectItem>
                <SelectItem value="seo">SEO</SelectItem>
                <SelectItem value="prerequisites">Pré-requisitos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsList className="hidden md:grid w-full grid-cols-6">
            <TabsTrigger className="flex-shrink-0" value="basic">
              Básico
            </TabsTrigger>
            <TabsTrigger className="flex-shrink-0" value="content">
              Conteúdo
            </TabsTrigger>
            <TabsTrigger className="flex-shrink-0" value="media">
              Mídia
            </TabsTrigger>
            <TabsTrigger className="flex-shrink-0" value="settings">
              Configurações
            </TabsTrigger>
            <TabsTrigger className="flex-shrink-0" value="seo">
              SEO
            </TabsTrigger>
            <TabsTrigger className="flex-shrink-0" value="prerequisites">
              Pré-requisitos
            </TabsTrigger>
          </TabsList>

          {/* Aba Básico */}
          <TabsContent value="basic" className="space-y-4">
            <BasicForm
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              availableSubcategories={availableSubcategories}
            />
          </TabsContent>

          {/* Aba Conteúdo */}
          <TabsContent value="content" className="space-y-4">
            <ContentForm />
          </TabsContent>

          {/* Aba Mídia */}
          <TabsContent value="media" className="space-y-4">
            <MediaForm
              courseId={mode === "edit" ? initialCourse?.id : undefined}
            />
          </TabsContent>

          {/* Aba Configurações */}
          <TabsContent value="settings" className="space-y-4">
            <SettingsForm />
          </TabsContent>

          {/* Aba SEO */}
          <TabsContent value="seo" className="space-y-4">
            <SeoForm />
          </TabsContent>

          {/* Aba Pré-requisitos */}
          <TabsContent value="prerequisites" className="space-y-4">
            <PrerequisitesForm />
          </TabsContent>
        </Tabs>

        {/* Botões de ação */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4 py-4 px-6 items-stretch sm:items-center border-t">
          <Button
            className="w-full sm:w-auto"
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            className="w-full sm:w-auto"
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              isPending
              // || !form.formState.isValid || !form.formState.isDirty
            }
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending
              ? mode === "edit"
                ? "Salvando..."
                : "Criando..."
              : mode === "edit"
              ? "Salvar Alterações"
              : "Criar Curso"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
