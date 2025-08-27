"use client";

import {
  Archive,
  BookOpen,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  archiveCourse,
  deleteCourse,
  duplicateCourse,
  publishCourse,
  toggleCourseFeatured,
} from "@/actions/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminCourseListItem } from "./types";

export default function CoursesTable({
  courses,
  onCourseUpdated,
  onCourseRemoved,
}: {
  courses: AdminCourseListItem[];
  onCourseUpdated: (
    courseId: string,
    data: Partial<AdminCourseListItem>
  ) => void;
  onCourseRemoved: (courseId: string) => void;
}) {
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

  const handleDuplicateCourse = async (courseId: string) => {
    try {
      const result = await duplicateCourse(courseId);
      if (result.success) {
        toast.success("Curso duplicado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao duplicar curso");
      }
    } catch {
      toast.error("Erro ao duplicar curso");
    }
  };

  const handleArchiveCourse = async (courseId: string) => {
    try {
      const result = await archiveCourse(courseId);
      if (result.success) {
        toast.success("Curso arquivado com sucesso!");
        onCourseUpdated(courseId, { status: "ARCHIVED" });
      } else {
        toast.error(result.error || "Erro ao arquivar curso");
      }
    } catch {
      toast.error("Erro ao arquivar curso");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !confirm(
        "Tem certeza que deseja deletar este curso? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }
    try {
      const result = await deleteCourse(courseId);
      if (result.success) {
        toast.success("Curso deletado com sucesso!");
        onCourseRemoved(courseId);
      } else {
        toast.error(result.error || "Erro ao deletar curso");
      }
    } catch {
      toast.error("Erro ao deletar curso");
    }
  };

  const handleToggleFeatured = async (
    courseId: string,
    currentFeatured: boolean
  ) => {
    try {
      const result = await toggleCourseFeatured(courseId);
      if (result.success) {
        toast.success(
          currentFeatured
            ? "Curso removido dos destaques"
            : "Curso adicionado aos destaques"
        );
        onCourseUpdated(courseId, { isFeatured: !currentFeatured });
      } else {
        toast.error(result.error || "Erro ao alterar destaque");
      }
    } catch {
      toast.error("Erro ao alterar destaque");
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      const result = await publishCourse(courseId);
      if (result.success) {
        toast.success("Curso publicado com sucesso!");
        onCourseUpdated(courseId, { status: "PUBLISHED" });
      } else {
        toast.error(result.error || "Erro ao publicar curso");
      }
    } catch {
      toast.error("Erro ao publicar curso");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Curso</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Inscrições</TableHead>
            <TableHead>Módulos</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nenhum curso encontrado.
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {course.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {course.shortDescription || course.description}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {course.isFeatured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            Destaque
                          </Badge>
                        )}
                        {course.isPremium && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                        {course.isPublic ? (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="mr-1 h-3 w-3" />
                            Público
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="mr-1 h-3 w-3" />
                            Privado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {course.category?.name || "N/A"}
                    </div>
                    {course.subcategory && (
                      <div className="text-sm text-muted-foreground">
                        {course.subcategory.name}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className={getLevelColor(course.level)}>
                    {getLevelText(course.level)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className={getStatusColor(course.status)}>
                    {getStatusText(course.status)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="font-medium">
                    {course.price === 0 ? (
                      <span className="text-green-600">Gratuito</span>
                    ) : (
                      `${course.currency} ${course.price.toFixed(2)}`
                    )}
                  </div>
                  {typeof course.originalPrice === "number" &&
                    course.originalPrice > course.price && (
                      <div className="text-sm text-muted-foreground line-through">
                        {course.currency} {course.originalPrice.toFixed(2)}
                      </div>
                    )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course._count?.enrollments || 0}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{course._count?.modules || 0}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {new Date(course.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/dashboard/courses/${course.slug}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
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
                      <DropdownMenuItem
                        onClick={() => handleDuplicateCourse(course.id)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </DropdownMenuItem>

                      {course.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() => handlePublishCourse(course.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Publicar
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleFeatured(course.id, course.isFeatured)
                        }
                      >
                        <Star className="mr-2 h-4 w-4" />
                        {course.isFeatured
                          ? "Remover Destaque"
                          : "Adicionar Destaque"}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {course.status !== "ARCHIVED" ? (
                        <DropdownMenuItem
                          onClick={() => handleArchiveCourse(course.id)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Arquivar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleArchiveCourse(course.id)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Desarquivar
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
