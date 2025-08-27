import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import {
  Copy,
  Eye,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CSS } from "@dnd-kit/utilities";

export default function SortableLesson({
  id,
  index,
  title,
  courseSlug,
  moduleSlug,
  lessonSlug,
  onDelete,
  router,
}: {
  id: string;
  index: number;
  title: string;
  courseSlug: string;
  moduleSlug: string;
  lessonSlug?: string | null;
  onDelete: (lesson: { id: string; title: string }) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between rounded-lg border-2 border-border/50 bg-card/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/80 hover:shadow-md",
        isDragging &&
          "ring-2 ring-primary/50 ring-offset-2 ring-offset-background scale-105 z-50"
      )}
    >
      <div className="flex items-center gap-3" {...attributes} {...listeners}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-sm font-bold">{index}</span>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground/60 hover:text-primary transition-colors" />
        <span className="font-medium text-sm text-foreground/90">{title}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/dashboard/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`
              )
            }
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar Aula
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete({ id, title })}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
