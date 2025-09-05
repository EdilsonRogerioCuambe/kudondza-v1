"use client";

import { useEffect, useState } from "react";

import { getModulesByCourseId } from "@/actions/courses/modules/get-modules";
import { reorderModules } from "@/actions/courses/modules/reorder-modules";
import { CreateForm } from "@/components/ui/create-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SortableSection } from "@/components/ui/sortable-section";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import slugify from "slugify";
import { toast } from "sonner";

import { createModule } from "@/actions/courses/modules/create-module";
import { SortableItem } from "@/components/ui/sortable-list";

type ModuleItem = SortableItem & {
  order: number;
  isPublic: boolean;
  isRequired: boolean;
};

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

  // Auto-generate slug from title unless user touched slug
  useEffect(() => {
    if (!slugTouched) {
      const auto = slugify(newTitle, { lower: true, strict: true, trim: true });
      setNewSlug(auto);
    }
  }, [newTitle, slugTouched]);

  async function handleReorder(newModules: ModuleItem[]) {
    setModules(newModules);
    // Auto-salvar imediatamente após mover
    if (courseId) {
      const orderedIds = newModules.map((m) => m.id);
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

  const getEditModuleUrl = (module: ModuleItem) => {
    if (courseSlug && module.slug) {
      return `/admin/dashboard/courses/${courseSlug}/modules/${module.slug}`;
    }
    return "#";
  };

  return (
    <div className="space-y-6">
      {/* Formulário de criação */}
      <CreateForm
        title="Estrutura do curso"
        subtitle="Adicione e organize os módulos do curso"
        onSubmit={handleCreateModule}
        submitLabel="Adicionar módulo"
        loading={creating}
        disabled={!courseId || !newTitle.trim()}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
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
          </div>
        </div>
      </CreateForm>

      {/* Lista de módulos */}
      {!courseId && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Salve o curso primeiro para gerenciar módulos.
          </p>
        </div>
      )}

      {courseId && (
        <SortableSection
          title="Módulos do curso"
          subtitle="Arraste para reordenar os módulos"
          items={modules}
          onReorder={handleReorder}
          editUrl={getEditModuleUrl}
          loading={loading}
          emptyMessage="Nenhum módulo cadastrado ainda."
        />
      )}
    </div>
  );
}
