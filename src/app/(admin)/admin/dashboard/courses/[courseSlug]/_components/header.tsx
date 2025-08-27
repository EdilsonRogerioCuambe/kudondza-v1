import {
  archiveCourse,
  deleteCourse,
  duplicateCourse,
  publishCourse,
  toggleCourseFeatured,
} from "@/actions/courses";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeaderProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    thumbnail?: string;
    status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | "SUSPENDED";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    category?: { id: string; name: string; slug?: string };
    subcategory?: { id: string; name: string; slug?: string };
    price: number;
    originalPrice?: number;
    currency: string;
    tags?: string[];
    isFeatured?: boolean;
    createdAt: string;
  };
}

export default function Header({ course }: HeaderProps) {
  const router = useRouter();
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
    }
  };

  const handleArchiveCourse = async () => {
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
    }
  };

  const handleToggleFeatured = async () => {
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
    }
  };

  const handlePublishCourse = async () => {
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
    }
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            {course.thumbnail ? (
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-md"
                  width={320}
                  height={180}
                />
              </AspectRatio>
            ) : (
              <div className="w-full h-40 md:h-48 bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">Sem thumbnail</span>
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {course.title}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Criado em {""}
                  {new Date(course.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="hidden md:block">
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
                        router.push(
                          `/admin/dashboard/courses/${course.slug}/edit`
                        )
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
                      {course.isFeatured
                        ? "Remover Destaque"
                        : "Adicionar Destaque"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleArchiveCourse}>
                      <Archive className="mr-2 h-4 w-4" />
                      {course.status !== "ARCHIVED"
                        ? "Arquivar"
                        : "Desarquivar"}
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

            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(course.status)}>
                {getStatusText(course.status)}
              </Badge>
              <Badge className={getLevelColor(course.level)}>
                {getLevelText(course.level)}
              </Badge>
              {course.category?.name && (
                <Badge variant="outline">{course.category.name}</Badge>
              )}
              {course.subcategory?.name && (
                <Badge variant="outline">{course.subcategory.name}</Badge>
              )}
            </div>

            {course.shortDescription && (
              <p className="text-sm leading-relaxed">
                {course.shortDescription}
              </p>
            )}

            <div className="flex items-center gap-3">
              {course.price === 0 ? (
                <span className="text-green-600 font-semibold">Gratuito</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold">
                    {course.currency} {course.price.toFixed(2)}
                  </span>
                  {course.originalPrice &&
                    course.originalPrice > course.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {course.currency} {course.originalPrice.toFixed(2)}
                      </span>
                    )}
                </div>
              )}
            </div>

            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
