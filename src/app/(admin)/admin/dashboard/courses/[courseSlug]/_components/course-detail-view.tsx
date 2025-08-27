"use client";

import {
  Archive,
  ArrowLeft,
  BookOpen,
  Copy,
  Edit,
  Eye,
  FileArchive,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MoreHorizontal,
  Settings,
  Star,
  Trash2,
  Trophy,
  Users,
  Video as VideoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Course as CourseType, UnlockCriteria } from "@/@types/types";
import {
  archiveCourse,
  deleteCourse,
  duplicateCourse,
  publishCourse,
  toggleCourseFeatured,
} from "@/actions/courses";
import Image from "next/image";
import Header from "./header";

interface CourseView extends CourseType {
  createdAt: string;
  updatedAt?: string;
  category?: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string };
  instructor?: { id: string; name: string; email: string; image?: string };
  _count?: { modules: number; enrollments: number; reviews: number };
  isFeatured?: boolean;
}

interface CourseDetailViewProps {
  course: CourseView;
}

// Componente de estatísticas do curso
function CourseStats({ course }: { course: CourseView }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Módulos</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {course._count?.modules || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inscrições</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {course._count?.enrollments || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {course._count?.reviews || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            XP de Recompensa
          </CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{course.xpReward}</div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal de visualização do curso
export default function CourseDetailView({ course }: CourseDetailViewProps) {
  const router = useRouter();
  const [_isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "REVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Publicado";
      case "DRAFT":
        return "Rascunho";
      case "REVIEW":
        return "Em Revisão";
      case "ARCHIVED":
        return "Arquivado";
      case "SUSPENDED":
        return "Suspenso";
      default:
        return status;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "ADVANCED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "EXPERT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "Iniciante";
      case "INTERMEDIATE":
        return "Intermediário";
      case "ADVANCED":
        return "Avançado";
      case "EXPERT":
        return "Especialista";
      default:
        return level;
    }
  };

  const handleDuplicateCourse = async () => {
    setIsPending(true);
    try {
      const result = await duplicateCourse(course.id);
      if (result.success) {
        toast.success("Curso duplicado com sucesso!");
        router.push("/admin/dashboard/courses");
      } else {
        toast.error(result.error || "Erro ao duplicar curso");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao duplicar curso");
    } finally {
      setIsPending(false);
    }
  };

  const handleArchiveCourse = async () => {
    setIsPending(true);
    try {
      const result = await archiveCourse(course.id);
      if (result.success) {
        toast.success("Curso arquivado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao arquivar curso");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao arquivar curso");
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (
      !confirm(
        "Tem certeza que deseja deletar este curso? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setIsPending(true);
    try {
      const result = await deleteCourse(course.id);
      if (result.success) {
        toast.success("Curso deletado com sucesso!");
        router.push("/admin/dashboard/courses");
      } else {
        toast.error(result.error || "Erro ao deletar curso");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar curso");
    } finally {
      setIsPending(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsPending(true);
    try {
      const result = await toggleCourseFeatured(course.id);
      if (result.success) {
        toast.success(
          course.isFeatured
            ? "Curso removido dos destaques"
            : "Curso adicionado aos destaques"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao alterar destaque");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao alterar destaque");
    } finally {
      setIsPending(false);
    }
  };

  const handlePublishCourse = async () => {
    setIsPending(true);
    try {
      const result = await publishCourse(course.id);
      if (result.success) {
        toast.success("Curso publicado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao publicar curso");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao publicar curso");
    } finally {
      setIsPending(false);
    }
  };

  const renderMaterial = (url: string) => {
    try {
      const u = new URL(url);
      const pathname = u.pathname;
      const ext = pathname.split(".").pop()?.toLowerCase();
      const name = decodeURIComponent(pathname.split("/").pop() || url);
      let Icon: React.ElementType = FileIcon;
      if (ext) {
        if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
          Icon = ImageIcon;
        } else if (["mp4", "webm", "ogg", "mov", "m4v"].includes(ext)) {
          Icon = VideoIcon;
        } else if (["pdf", "md", "txt", "doc", "docx"].includes(ext)) {
          Icon = FileText;
        } else if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
          Icon = FileArchive;
        }
      } else {
        Icon = LinkIcon;
      }
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted transition-colors overflow-hidden"
        >
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 min-w-0 truncate" title={name}>
            {name}
          </span>
        </a>
      );
    } catch {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted transition-colors overflow-hidden"
        >
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 min-w-0 truncate" title={url}>
            {url}
          </span>
        </a>
      );
    }
  };

  const renderDescription = () => {
    if (!course.description) return null;
    const hasHtml = /<[^>]+>/.test(course.description);
    if (hasHtml) {
      return (
        <div
          className="prose prose-sm dark:prose-invert max-w-none break-words"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      );
    }
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {course.description}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com navegação e ações rápidas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/dashboard/courses")}
          >
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
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/dashboard/courses/${course.slug}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicateCourse}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              {course.status === "DRAFT" && (
                <DropdownMenuItem onClick={handlePublishCourse}>
                  <Eye className="mr-2 h-4 w-4" />
                  Publicar
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleToggleFeatured}>
                <Star className="mr-2 h-4 w-4" />
                {course.isFeatured ? "Remover Destaque" : "Adicionar Destaque"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleArchiveCourse}>
                <Archive className="mr-2 h-4 w-4" />
                {course.status !== "ARCHIVED" ? "Arquivar" : "Desarquivar"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteCourse}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Header
        course={{
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          thumbnail: course.thumbnail,
          status: course.status,
          level: course.level,
          category: course.category
            ? {
                id: course.category.id,
                name: course.category.name,
                slug: course.category.slug,
              }
            : undefined,
          subcategory: course.subcategory
            ? {
                id: course.subcategory.id,
                name: course.subcategory.name,
                slug: course.subcategory.slug,
              }
            : undefined,
          price: course.price,
          originalPrice: course.originalPrice,
          currency: course.currency,
          tags: course.tags,
          isFeatured: course.isFeatured,
          createdAt: course.createdAt,
        }}
      />

      {/* Estatísticas */}
      <CourseStats course={course} />

      {/* Informações principais */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações básicas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Informações do Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge className={getStatusColor(course.status)}>
                    {getStatusText(course.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nível
                </label>
                <div className="mt-1">
                  <Badge className={getLevelColor(course.level)}>
                    {getLevelText(course.level)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Categoria
                </label>
                <div className="mt-1 text-sm">
                  {course.category?.name || "N/A"}
                  {course.subcategory && (
                    <span className="text-muted-foreground">
                      {" "}
                      → {course.subcategory.name}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Idioma
                </label>
                <div className="mt-1 text-sm">
                  {course.language === "pt"
                    ? "Português"
                    : course.language === "en"
                    ? "Inglês"
                    : course.language === "es"
                    ? "Espanhol"
                    : course.language}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Preço
                </label>
                <div className="mt-1 text-sm">
                  {course.price === 0 ? (
                    <span className="text-green-600 font-medium">Gratuito</span>
                  ) : (
                    <div className="text-sm font-medium">
                      {course.currency} {course.price.toFixed(2)}
                    </div>
                  )}
                  {course.originalPrice &&
                    course.originalPrice > course.price && (
                      <div className="text-muted-foreground line-through">
                        {course.currency} {course.originalPrice.toFixed(2)}
                      </div>
                    )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Duração
                </label>
                <div className="mt-1 text-sm">
                  {course.duration
                    ? `${course.duration} minutos`
                    : "Não definido"}
                </div>
              </div>
            </div>

            {course.shortDescription && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descrição Curta
                </label>
                <div className="mt-1 text-sm">{course.shortDescription}</div>
              </div>
            )}

            {course.tags && course.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tags
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar com configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Público</span>
                <Badge variant={course.isPublic ? "default" : "secondary"}>
                  {course.isPublic ? "Sim" : "Não"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Premium</span>
                <Badge variant={course.isPremium ? "default" : "secondary"}>
                  {course.isPremium ? "Sim" : "Não"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Download</span>
                <Badge variant={course.allowDownload ? "default" : "secondary"}>
                  {course.allowDownload ? "Permitido" : "Bloqueado"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Destaque</span>
                <Badge variant={course.isFeatured ? "default" : "secondary"}>
                  {course.isFeatured ? "Sim" : "Não"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pré-requisitos</span>
                <Badge
                  variant={course.hasPrerequisites ? "default" : "secondary"}
                >
                  {course.hasPrerequisites ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">XP de Recompensa</div>
              <div className="text-2xl font-bold text-blue-600">
                {course.xpReward}
              </div>
            </div>

            {course.badgeId && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Badge</div>
                <Badge variant="outline">{course.badgeId}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo em abas */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Mobile select */}
            <div className="mb-3 md:hidden">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar seção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="description">Descrição</SelectItem>
                  <SelectItem value="media">Mídia</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="prerequisites">Pré-requisitos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-4">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="media">Mídia</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="prerequisites">Pré-requisitos</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Descrição Detalhada
                </h3>
                {course.description ? (
                  renderDescription()
                ) : (
                  <p className="text-muted-foreground">
                    Nenhuma descrição definida.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                  {course.trailer ? (
                    <AspectRatio ratio={16 / 9}>
                      <video
                        className="w-full h-full rounded-lg bg-black"
                        controls
                        poster={course.thumbnail}
                        preload="metadata"
                      >
                        <source src={course.trailer} />
                        Seu navegador não suporta a tag de vídeo.
                      </video>
                    </AspectRatio>
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">
                        Nenhum trailer
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Thumbnail</h3>
                  {course.thumbnail ? (
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover rounded-lg"
                      />
                    </AspectRatio>
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">
                        Nenhuma imagem
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {course.courseMaterials && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Materiais</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {renderMaterial(course.courseMaterials)}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Título SEO</h3>
                  <p className="text-sm">{course.seoTitle || "Não definido"}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Descrição SEO</h3>
                  <p className="text-sm">
                    {course.seoDescription || "Não definido"}
                  </p>
                </div>
              </div>

              {course.seoKeywords && course.seoKeywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Palavras-chave SEO
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.seoKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="prerequisites" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pré-requisitos</h3>
                {course.hasPrerequisites ? (
                  <div>
                    {(course.unlockCriteria as UnlockCriteria | undefined)
                      ?.type === "prerequisite" &&
                    (course.unlockCriteria as { courseIds: string[] }).courseIds
                      ?.length ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Cursos que devem ser concluídos:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {(
                            course.unlockCriteria as { courseIds: string[] }
                          ).courseIds.map((courseId: string, index: number) => (
                            <li key={index} className="text-sm">
                              Curso ID: {courseId}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Pré-requisitos configurados mas sem cursos específicos.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Este curso não possui pré-requisitos.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
