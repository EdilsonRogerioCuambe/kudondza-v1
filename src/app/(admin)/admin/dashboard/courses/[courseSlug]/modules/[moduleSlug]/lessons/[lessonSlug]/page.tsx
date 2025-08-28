"use client";

import {
  getLessonBySlug,
  updateLessonContent,
  updateLessonTranscript,
} from "@/actions/courses/modules";
import ByteMDEditor from "@/components/byte-md-editor";
import CyberpunkResources from "@/components/cyberpunk-resources";
import CyberpunkTranscriptEditor from "@/components/cyberpunk-transcript-editor";
import CyberpunkVideoPlayer from "@/components/cyberpunk-video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LessonHeader from "./_components/lesson-header";
import LessonStats from "./_components/lesson-stats";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface LessonData {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    shortDescription: string | null;
    order: number;
    slug: string | null;
    videoId: string | null;
    videoUrl: string | null;
    videoDuration: number | null;
    transcript: string | null;
    isPreview: boolean;
    isRequired: boolean;
    isPublic: boolean;
    unlockCriteria: Record<string, unknown> | null;
    xpReward: number;
    createdAt: Date;
    updatedAt: Date;
    moduleId: string;
    resources: Array<{
      id: string;
      title: string;
      description: string | null;
      url: string;
      type: string;
    }>;
  };
  module: {
    id: string;
    title: string;
    slug: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const courseSlug = params.courseSlug as string;
  const moduleSlug = params.moduleSlug as string;
  const lessonSlug = params.lessonSlug as string;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const result = await getLessonBySlug(
          courseSlug,
          moduleSlug,
          lessonSlug
        );

        if (result.success && result.data) {
          setLessonData(result.data as LessonData);
        } else {
          setError(result.error || "Erro ao carregar a lição");
        }
      } catch (err) {
        setError("Erro inesperado ao carregar a lição");
        console.error("Erro ao buscar lição:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug && moduleSlug && lessonSlug) {
      fetchLesson();
    }
  }, [courseSlug, moduleSlug, lessonSlug]);

  const handleTranscriptSave = async (transcript: string) => {
    if (!lessonData?.lesson.id) return;

    try {
      const result = await updateLessonTranscript(
        lessonData.lesson.id,
        transcript
      );
      if (result.success) {
        toast.success("Transcrição salva com sucesso!");
        setLessonData((prev) =>
          prev
            ? {
                ...prev,
                lesson: {
                  ...prev.lesson,
                  transcript: result.data.transcript,
                  updatedAt: result.data.updatedAt,
                },
              }
            : null
        );
      } else {
        toast.error(result.error || "Erro ao salvar transcrição");
      }
    } catch (error) {
      toast.error("Erro inesperado ao salvar transcrição");
      console.error("Erro ao salvar transcrição:", error);
    }
  };

  const handleContentSave = async (content: string) => {
    if (!lessonData?.lesson.id) return;

    try {
      const result = await updateLessonContent(lessonData.lesson.id, content);
      if (result.success) {
        toast.success("Conteúdo salvo com sucesso!");
        setLessonData((prev) =>
          prev
            ? {
                ...prev,
                lesson: {
                  ...prev.lesson,
                  description: result.data.description,
                  updatedAt: result.data.updatedAt,
                },
              }
            : null
        );
      } else {
        toast.error(result.error || "Erro ao salvar conteúdo");
      }
    } catch (error) {
      toast.error("Erro inesperado ao salvar conteúdo");
      console.error("Erro ao salvar conteúdo:", error);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <BookOpen className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-primary font-mono">Carregando lição...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !lessonData) {
    return (
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Card className="bg-card border border-destructive/30 backdrop-blur-sm max-w-md">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-destructive font-mono mb-2">
                Erro ao carregar lição
              </h3>
              <p className="text-muted-foreground font-mono mb-4">
                {error || "Não foi possível carregar os dados da lição"}
              </p>
              <Button
                onClick={() => router.back()}
                className="bg-destructive/20 hover:bg-destructive/30 border border-destructive/30 text-destructive hover:text-destructive/80 font-mono"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { lesson, module, course } = lessonData;

  const renderDescription = () => {
      if (!lesson.description) return null;
      const hasHtml = /<[^>]+>/.test(lesson.description);
      if (hasHtml) {
        return (
          <div
            className="prose prose-sm dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: lesson.description }}
          />
        );
      }
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.description}
          </ReactMarkdown>
        </div>
      );
    };

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-6">
        {/* Header com navegação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Header da aula */}
        <LessonHeader lesson={lesson} module={module} course={course} />

        {/* Estatísticas */}
        <LessonStats lesson={lesson} />

        {/* Conteúdo em abas */}
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo da Aula</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="video">Vídeo</TabsTrigger>
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informações Técnicas */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Status da Aula
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">Preview</span>
                          <Badge
                            variant={lesson.isPreview ? "default" : "secondary"}
                          >
                            {lesson.isPreview ? "Sim" : "Não"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">Obrigatória</span>
                          <Badge
                            variant={
                              lesson.isRequired ? "destructive" : "secondary"
                            }
                          >
                            {lesson.isRequired ? "Sim" : "Não"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">Pública</span>
                          <Badge
                            variant={lesson.isPublic ? "default" : "secondary"}
                          >
                            {lesson.isPublic ? "Sim" : "Não"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Informações Técnicas
                      </h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="font-mono text-xs break-all">
                            {lesson.videoId || "Não definido"}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">
                            Slug
                          </div>
                          <div className="font-mono text-xs">
                            {lesson.slug || "Não definido"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Critérios de Desbloqueio e Metadados */}
                  <div className="space-y-6">
                    {/* Critérios de Desbloqueio */}
                    {lesson.unlockCriteria && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          Critérios de Desbloqueio
                        </h4>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                            {String(
                              JSON.stringify(
                                lesson.unlockCriteria as Record<
                                  string,
                                  unknown
                                >,
                                null,
                                2
                              )
                            )}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Metadados da Aula */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Metadados
                      </h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">
                            Criada em
                          </div>
                          <div className="text-sm">
                            {new Date(lesson.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">
                            Última atualização
                          </div>
                          <div className="text-sm">
                            {new Date(lesson.updatedAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-6">
                {lesson.videoUrl || lesson.videoId ? (
                  <>
                    {/* Player de Vídeo */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Vídeo da Aula
                      </h3>
                      <CyberpunkVideoPlayer
                        videoUrl={lesson.videoUrl}
                        videoId={lesson.videoId}
                        className="mb-6"
                      />
                    </div>

                    {/* Transcrição */}
                    {lesson.transcript && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Transcrição
                          </h3>
                          <CyberpunkTranscriptEditor
                            transcript={lesson.transcript}
                            onSave={handleTranscriptSave}
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <p className="text-sm">
                        Nenhum vídeo configurado para esta aula.
                      </p>
                      <p className="text-xs mt-1">
                        Configure um vídeo na aba de edição da aula.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {lesson.description ? (
                  <>
                    {/* Visualização do Conteúdo */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Conteúdo da Aula
                      </h3>
                      {renderDescription()}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Mensagem quando não há conteúdo */}
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-6">
                        <p className="text-sm">
                          Nenhum conteúdo disponível para esta aula.
                        </p>
                        <p className="text-xs mt-1">
                          Use o editor abaixo para adicionar conteúdo.
                        </p>
                      </div>
                    </div>

                    {/* Editor de Conteúdo */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Adicionar Conteúdo
                      </h3>
                      <ByteMDEditor
                        value=""
                        onChange={(content) => handleContentSave(content)}
                        placeholder="Digite o conteúdo da aula aqui..."
                        className="min-h-[500px]"
                      />
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                {lesson.resources.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Recursos da Aula ({lesson.resources.length})
                    </h3>
                    <CyberpunkResources resources={lesson.resources} />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <p className="text-sm">
                        Nenhum recurso disponível para esta aula.
                      </p>
                      <p className="text-xs mt-1">
                        Adicione recursos na aba de edição da aula.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
