"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ByteMDEditor from "@/components/byte-md-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditForm } from "@/components/ui/edit-form";
import { FileUploadField } from "@/components/ui/file-upload-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploadField } from "./media-upload-field";

import { updateLesson } from "@/actions/courses/modules";
import { CreateLessonInput } from "@/actions/courses/modules/create-lesson";
import { getResourcesByLesson } from "@/actions/courses/modules/lesson-resources";

// Tipos
interface MediaFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  duration?: number;
  error?: string;
  resourceId?: string;
}
interface LessonData {
  id: string;
  title: string;
  slug: string | null;
  description?: string;
  shortDescription?: string;
  order: number;
  videoUrl?: string;
  isPreview: boolean;
  isRequired: boolean;
  isPublic: boolean;
  unlockCriteria: unknown;
  xpReward: number;
  moduleId: string;
  resources: Array<{
    id: string;
    title: string;
    description: string | null;
    url: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface LessonUpsertFormProps {
  mode: "edit";
  initialLesson: LessonData;
  onSuccess: (lesson: LessonData) => void;
  onCancel: () => void;
}

function mapLessonToForm(lesson: LessonData): CreateLessonInput {
  return {
    moduleId: lesson.moduleId,
    title: lesson.title,
    slug: lesson.slug || "",
    description: lesson.description || "",
    shortDescription: lesson.shortDescription || "",
    videoUrl: lesson.videoUrl || "",
    isPreview: lesson.isPreview,
    isRequired: lesson.isRequired,
    isPublic: lesson.isPublic,
    xpReward: lesson.xpReward,
  };
}

export function LessonUpsertForm({
  mode,
  initialLesson,
  onSuccess,
  onCancel,
}: LessonUpsertFormProps) {
  const [isPending, startTransition] = useTransition();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  // Carregar resources existentes
  useEffect(() => {
    const loadExistingResources = async () => {
      try {
        const result = await getResourcesByLesson(initialLesson.id);
        if (result.success && result.data) {
          const existingMediaFiles: MediaFile[] = result.data.map(
            (resource) => ({
              id: Math.random().toString(36).substr(2, 9),
              file: new File([], resource.title, {
                type: resource.mimeType || "text/plain",
              }),
              progress: 100,
              status: "completed" as const,
              url: resource.url,
              resourceId: resource.id,
            })
          );
          setMediaFiles(existingMediaFiles);
        }
      } catch (error) {
        console.error("Erro ao carregar resources:", error);
      }
    };

    if (mode === "edit" && initialLesson) {
      loadExistingResources();
    }
  }, [mode, initialLesson]);

  // Valores padrão do formulário
  const defaultValues: CreateLessonInput =
    mode === "edit" && initialLesson
      ? mapLessonToForm(initialLesson)
      : {
          moduleId: "",
          title: "",
          slug: "",
          description: "",
          shortDescription: "",
          videoUrl: "",
          isPreview: false,
          isRequired: true,
          isPublic: false,
          xpReward: 50,
        };

  const form = useForm<CreateLessonInput>({
    defaultValues,
  });

  const onSubmit = (data: CreateLessonInput) => {
    startTransition(async () => {
      try {
        // Atualizar a aula
        const result = await updateLesson(initialLesson.id, data);
        if (result.success) {
          // Os resources já são salvos automaticamente durante o upload no MediaUploadField
          onSuccess({
            ...initialLesson,
            ...data,
            slug: data.slug || null,
            description: data.description || undefined,
            shortDescription: data.shortDescription || undefined,
            videoUrl: data.videoUrl || undefined,
            isRequired: data.isRequired ?? false,
          });
        } else {
          toast.error(result.error || "Erro ao atualizar aula");
        }
      } catch (error) {
        console.error("Erro ao atualizar aula:", error);
        toast.error("Erro inesperado ao atualizar aula");
      }
    });
  };

  const tabs = [
    {
      value: "basic",
      label: "Básico",
      content: (
        <div className="min-w-0">
          <Card className="min-w-0">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg">
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o título da aula"
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="slug-da-aula"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Descrição Curta</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite uma descrição curta da aula"
                        className="resize-none text-sm min-h-[80px] md:min-h-[100px]"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "media",
      label: "Mídias",
      content: (
        <div className="min-w-0">
          <Card className="min-w-0">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg">
                Mídias da Aula
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6 min-w-0">
              <div className="w-full min-w-0">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FileUploadField
                      label="Vídeo Principal da Aula"
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
                      accept={{
                        "video/*": [
                          ".mp4",
                          ".avi",
                          ".mov",
                          ".wmv",
                          ".flv",
                          ".webm",
                        ],
                      }}
                      lessonId={initialLesson.id}
                      className="w-full"
                    />
                  )}
                />
              </div>

              <div className="w-full min-w-0">
                <MediaUploadField
                  value={mediaFiles}
                  onChange={setMediaFiles}
                  label="Mídias Adicionais da Aula"
                  placeholder="URL da mídia (YouTube, Vimeo, etc.)"
                  lessonId={initialLesson.id}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "content",
      label: "Conteúdo",
      content: (
        <div className="min-w-0">
          <Card className="min-w-0">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg">
                Conteúdo da Aula
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6 min-w-0">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Descrição Detalhada
                    </FormLabel>
                    <FormControl>
                      <div className="border rounded-md min-w-0">
                        <ByteMDEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Digite a descrição detalhada da aula..."
                          className="min-h-[300px] md:min-h-[400px]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "settings",
      label: "Configurações",
      content: (
        <div className="min-w-0">
          <Card className="min-w-0">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg">
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <FormField
                  control={form.control}
                  name="xpReward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        XP de Recompensa
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="space-y-0.5 flex-1">
                    <FormLabel className="text-sm">Aula de Preview</FormLabel>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Permite que esta aula seja visualizada sem estar inscrito
                      no curso
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="isPreview"
                    render={({ field }) => (
                      <FormItem>
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="space-y-0.5 flex-1">
                    <FormLabel className="text-sm">Aula Obrigatória</FormLabel>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Esta aula deve ser concluída para avançar no curso
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="isRequired"
                    render={({ field }) => (
                      <FormItem>
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="space-y-0.5 flex-1">
                    <FormLabel className="text-sm">Aula Pública</FormLabel>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Esta aula pode ser acessada por qualquer usuário
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem>
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
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <Form {...form}>
      <EditForm
        title={mode === "edit" ? "Editar Aula" : "Nova Aula"}
        subtitle={
          mode === "edit"
            ? "Atualize as informações da aula"
            : "Preencha as informações da nova aula"
        }
        onSubmit={form.handleSubmit(onSubmit)}
        onCancel={onCancel}
        loading={isPending}
        tabs={tabs}
      />
    </Form>
  );
}
