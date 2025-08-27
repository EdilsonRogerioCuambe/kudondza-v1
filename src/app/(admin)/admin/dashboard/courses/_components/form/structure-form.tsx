"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";

import { getModulesByCourseId } from "@/actions/courses/modules/get-modules";
import { reorderModules } from "@/actions/courses/modules/reorder-modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
} from "lucide-react";
import slugify from "slugify";
import { toast } from "sonner";

import { createModule } from "@/actions/courses/modules/create-module";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ModuleItem = {
  id: string;
  slug?: string | null;
  title: string;
  order: number;
  isPublic: boolean;
  isRequired: boolean;
};

function SortableItem({
  id,
  index,
  title,
  slug,
  courseSlug,
}: {
  id: string;
  index: number;
  title: string;
  slug?: string | null;
  courseSlug?: string;
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
      {...attributes}
      className={cn(
        "flex items-center justify-between rounded-md border bg-card px-3 py-2",
        isDragging && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2">
        <button className="cursor-grab" aria-label="Arrastar" {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="font-medium text-sm">
          {index}. {title}
        </span>
      </div>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            {courseSlug && slug && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/dashboard/courses/${courseSlug}/modules/${slug}`}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Editar módulo
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function StructureForm({
  courseId,
  courseSlug,
}: {
  courseId?: string;
  courseSlug?: string;
}) {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [newIsRequired, setNewIsRequired] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getModulesByCourseId(courseId)
      .then((res) => {
        if (res.success) setModules(res.data);
        else toast.error(res.error || "Falha ao carregar módulos");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const ids = useMemo(() => modules.map((m) => m.id), [modules]);

  // Auto-generate slug from title unless user touched slug
  useEffect(() => {
    if (!slugTouched) {
      const auto = slugify(newTitle, { lower: true, strict: true, trim: true });
      setNewSlug(auto);
    }
  }, [newTitle, slugTouched]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = modules.findIndex((m) => m.id === String(active.id));
    const newIndex = modules.findIndex((m) => m.id === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(modules, oldIndex, newIndex);
    setModules(next);
    // Auto-salvar imediatamente após mover
    if (courseId) {
      const orderedIds = next.map((m) => m.id);
      const res = await reorderModules(courseId, orderedIds);
      if (res.success) toast.success("Ordem atualizada");
      else toast.error(res.error || "Erro ao salvar ordem");
    }
  }

  async function handleCreateModule(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return;
    if (!newTitle.trim()) {
      toast.error("Informe o título do módulo");
      return;
    }
    if (newSlug && !/^[a-z0-9-]+$/.test(newSlug)) {
      toast.error("Slug deve conter apenas minúsculas, números e hífens");
      return;
    }
    try {
      setCreating(true);
      const res = await createModule({
        courseId,
        title: newTitle.trim(),
        slug: newSlug.trim() || undefined,
        description: newDescription.trim() || undefined,
        isPublic: newIsPublic,
        isRequired: newIsRequired,
        xpReward: 100,
      });
      if (res.success && res.data) {
        toast.success("Módulo criado");
        setNewTitle("");
        setNewSlug("");
        setNewDescription("");
        setNewIsPublic(false);
        setNewIsRequired(true);
        const list = await getModulesByCourseId(courseId);
        if (list.success) setModules(list.data);
      } else {
        toast.error(res.error || "Erro ao criar módulo");
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Estrutura do curso</CardTitle>
        </div>
        <form
          onSubmit={handleCreateModule}
          className="grid grid-cols-1 md:grid-cols-12 gap-3"
        >
          <div className="md:col-span-5">
            <Label htmlFor="module-title" className="text-xs">
              Título do módulo
            </Label>
            <Input
              id="module-title"
              placeholder="Ex.: Introdução"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={!courseId || creating}
            />
            <div className="mt-1 text-[11px] text-muted-foreground">
              Máx. 200 caracteres • {newTitle.length}/200
            </div>
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="module-slug" className="text-xs">
              Slug
            </Label>
            <Input
              id="module-slug"
              placeholder="ex.: introducao"
              value={newSlug}
              onChange={(e) => {
                setNewSlug(e.target.value);
                setSlugTouched(true);
              }}
              onFocus={() => setSlugTouched(true)}
              disabled={!courseId || creating}
            />
            <div className="mt-1 text-[11px] text-muted-foreground">
              Somente minúsculas, números e hífens
            </div>
          </div>
          <div className="md:col-span-4">
            <Label htmlFor="module-description" className="text-xs">
              Descrição (opcional)
            </Label>
            <Textarea
              id="module-description"
              placeholder="Breve descrição do módulo"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              disabled={!courseId || creating}
              className="min-h-[38px]"
            />
          </div>
          <div className="md:col-span-12 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="module-public"
                checked={newIsPublic}
                onCheckedChange={setNewIsPublic}
                disabled={!courseId || creating}
              />
              <Label htmlFor="module-public" className="text-sm">
                Público
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="module-required"
                checked={newIsRequired}
                onCheckedChange={setNewIsRequired}
                disabled={!courseId || creating}
              />
              <Label htmlFor="module-required" className="text-sm">
                Obrigatório
              </Label>
            </div>
            <div className="ml-auto">
              <Button
                type="submit"
                size="sm"
                disabled={!courseId || creating || !newTitle.trim()}
              >
                {creating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}{" "}
                Adicionar módulo
              </Button>
            </div>
          </div>
        </form>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent>
        {!courseId && (
          <p className="text-sm text-muted-foreground">
            Salve o curso primeiro para gerenciar módulos.
          </p>
        )}
        {courseId && loading && (
          <p className="text-sm text-muted-foreground">Carregando módulos...</p>
        )}
        {courseId && !loading && modules.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum módulo cadastrado ainda.
          </p>
        )}
        {courseId && modules.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {modules.map((m, idx) => (
                  <SortableItem
                    key={m.id}
                    id={m.id}
                    index={idx + 1}
                    title={m.title}
                    slug={m.slug}
                    courseSlug={courseSlug}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        {/* Removido botão de salvar: agora salva automaticamente ao mover */}
      </CardContent>
    </Card>
  );
}
