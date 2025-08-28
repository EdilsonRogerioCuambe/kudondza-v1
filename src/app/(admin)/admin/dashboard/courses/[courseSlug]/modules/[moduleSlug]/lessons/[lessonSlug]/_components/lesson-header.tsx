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
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calendar,
  Clock,
  Copy,
  Edit,
  Eye,
  Lock,
  MoreHorizontal,
  Play,
  Trash2,
  Trophy,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LessonData } from "../page";

export default function LessonHeader({ lesson, module, course }: LessonData) {
  const router = useRouter();

  const handleDuplicateLesson = async () => {
    toast.info("Funcionalidade de duplicação em desenvolvimento");
  };

  const handleDeleteLesson = async () => {
    if (
      !confirm(
        "Tem certeza que deseja deletar esta aula? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }
    toast.info("Funcionalidade de exclusão em desenvolvimento");
  };

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header Principal */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            {/* Informações Principais */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <BookOpen className="h-4 w-4" />
                <span>{course.title}</span>
                <span>•</span>
                <span>{module.title}</span>
                <span>•</span>
                <span className="font-medium text-foreground">
                  Aula {lesson.order}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-3xl font-bold tracking-tight mb-3">
                {lesson.title}
              </h1>

              {/* Metadados */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Criada em{" "}
                    {new Date(lesson.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {lesson.videoDuration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(lesson.videoDuration)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>{lesson.xpReward} XP</span>
                </div>
              </div>

              {/* Descrição Curta */}
              {lesson.shortDescription && (
                <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
                  {lesson.shortDescription}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(
                    `/admin/dashboard/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}/edit`
                  )
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDuplicateLesson}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar Aula
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteLesson}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar Aula
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Separator />

        {/* Status e Badges */}
        <div className="p-6 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Principal */}
            <div className="flex items-center gap-2">
              {lesson.isPreview ? (
                <Badge
                  variant="default"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Play className="h-3 w-3 mr-1" />
                  Aula Completa
                </Badge>
              )}
            </div>

            {/* Status de Acesso */}
            <div className="flex items-center gap-2">
              {lesson.isPublic ? (
                <Badge
                  variant="outline"
                  className="text-green-700 border-green-200"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Pública
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-orange-700 border-orange-200"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Privada
                </Badge>
              )}
            </div>

            {/* Status de Progresso */}
            <div className="flex items-center gap-2">
              {lesson.isRequired ? (
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-800 hover:bg-red-100"
                >
                  Obrigatória
                </Badge>
              ) : (
                <Badge variant="outline">Opcional</Badge>
              )}
            </div>

            {/* Indicador de Vídeo */}
            {lesson.videoUrl && (
              <Badge
                variant="outline"
                className="text-blue-700 border-blue-200"
              >
                <Video className="h-3 w-3 mr-1" />
                Com Vídeo
              </Badge>
            )}

            {/* Indicador de Recursos */}
            {lesson.resources.length > 0 && (
              <Badge
                variant="outline"
                className="text-purple-700 border-purple-200"
              >
                {lesson.resources.length} Recurso
                {lesson.resources.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
