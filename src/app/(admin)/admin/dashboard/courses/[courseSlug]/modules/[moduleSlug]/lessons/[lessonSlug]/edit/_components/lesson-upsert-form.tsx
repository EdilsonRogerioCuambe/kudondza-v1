"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ByteMDEditor from "@/components/byte-md-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditForm } from "@/components/ui/edit-form";
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
import { VideoUploadField } from "./video-upload-field";

import { updateLesson } from "@/actions/courses/modules";
import { CreateLessonInput } from "@/actions/courses/modules/create-lesson";

// Tipos
interface LessonData {
  id: string;
  title: string;
  slug: string | null;
  description?: string;
  shortDescription?: string;
  order: number;
  videoId?: string;
  videoUrl?: string;
  videoDuration?: number;
  transcript?: string;
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
    videoId: lesson.videoId || "",
    videoUrl: lesson.videoUrl || "",
    videoDuration: lesson.videoDuration || undefined,
    transcript: lesson.transcript || "",
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
          videoId: "",
          videoUrl: "",
          videoDuration: undefined,
          transcript: "",
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
        const result = await updateLesson(initialLesson.id, data);
        if (result.success) {
          onSuccess({
            ...initialLesson,
            ...data,
            slug: data.slug || null,
            description: data.description || undefined,
            shortDescription: data.shortDescription || undefined,
            videoId: data.videoId || undefined,
            videoUrl: data.videoUrl || undefined,
            videoDuration: data.videoDuration || undefined,
            transcript: data.transcript || undefined,
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
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
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
      ),
    },
    {
      value: "video",
      label: "Vídeo",
      content: (
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">
              Vídeo da Aula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <FormField
                control={form.control}
                name="videoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      ID do Vídeo (Panda Video)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID do vídeo no Panda Video"
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Duração (segundos)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Duração em segundos"
                        value={field.value?.toString() || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
              name="videoUrl"
              render={({ field }) => (
                <VideoUploadField
                  value={field.value || ""}
                  onChange={field.onChange}
                  label="Vídeo da Aula"
                  placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
                  lessonId={initialLesson.id}
                />
              )}
            />

            <FormField
              control={form.control}
              name="transcript"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Transcrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Transcrição do vídeo..."
                      className="resize-none min-h-[150px] md:min-h-[200px] text-sm"
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
      ),
    },
    {
      value: "content",
      label: "Conteúdo",
      content: (
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">
              Conteúdo da Aula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Descrição Detalhada</FormLabel>
                  <FormControl>
                    <div className="border rounded-md">
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
      ),
    },
    {
      value: "settings",
      label: "Configurações",
      content: (
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <FormField
                control={form.control}
                name="xpReward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">XP de Recompensa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    Permite que esta aula seja visualizada sem estar inscrito no
                    curso
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
