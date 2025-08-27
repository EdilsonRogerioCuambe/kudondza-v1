"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  FileText,
  Settings,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";

import { createLesson } from "@/actions/courses/modules/create-lesson";
import { deleteLesson } from "@/actions/courses/modules/delete-lesson";
import { getModuleWithLessonsBySlugs } from "@/actions/courses/modules/get-module-with-lessons";
import { reorderLessons } from "@/actions/courses/modules/reorder-lessons";
import { updateModule } from "@/actions/courses/modules/update-module";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Basic from "./_components/basic";
import Description from "./_components/description";
import Lessons from "./_components/lessons";

type LessonItem = {
  id: string;
  title: string;
  order: number;
  isPreview: boolean;
  isPublic: boolean;
  slug?: string | null;
};

export default function Page() {
  const params = useParams<{ courseSlug: string; moduleSlug: string }>();
  const router = useRouter();
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isRequired, setIsRequired] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [xpReward, setXpReward] = useState(100);
  const [unlockCriteria, setUnlockCriteria] = useState("");

  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonSlug, setNewLessonSlug] = useState("");

  // Delete confirmation modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Tab state for mobile
  const [activeTab, setActiveTab] = useState("basic");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const load = async () => {
      const res = await getModuleWithLessonsBySlugs(
        params.courseSlug,
        params.moduleSlug
      );
      if (!res.success || !res.data) {
        toast.error(res.error || "Erro ao carregar módulo");
        setLoading(false);
        return;
      }
      setModuleId(res.data.id);
      setCourseId(res.data.courseId); // Add this line
      setModuleTitle(res.data.title);
      setTitle(res.data.title);
      setSlug(res.data.slug || "");
      setDescription(res.data.description || "");
      setIsRequired(!!res.data.isRequired);
      setIsPublic(!!res.data.isPublic);
      setXpReward(res.data.xpReward ?? 100);
      setUnlockCriteria(
        res.data.unlockCriteria ? String(res.data.unlockCriteria) : ""
      );
      setLessons(
        res.data.lessons.map((lesson) => ({
          ...lesson,
          slug: lesson.slug ?? "",
        }))
      );
      setLoading(false);
    };
    load();
  }, [params.courseSlug, params.moduleSlug]);

  const ids = useMemo(() => lessons.map((l) => l.id), [lessons]);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = lessons.findIndex((l) => l.id === String(active.id));
    const newIndex = lessons.findIndex((l) => l.id === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    setLessons((arr) => arrayMove(arr, oldIndex, newIndex));
  }

  async function onSaveOrder() {
    if (!moduleId) return;
    setSaving(true);
    const ordered = lessons.map((l) => l.id);
    const res = await reorderLessons(moduleId, ordered);
    setSaving(false);
    if (res.success) toast.success("Ordem de aulas atualizada");
    else toast.error(res.error || "Erro ao salvar ordem");
  }

  async function onSaveModule() {
    if (!moduleId) return;
    setSaving(true);
    const res = await updateModule({
      id: moduleId,
      title: title.trim(),
      slug: slug.trim() || null,
      description: description.trim() || null,
      isRequired,
      isPublic,
      xpReward,
      unlockCriteria: unlockCriteria.trim() || null,
    });
    setSaving(false);
    if (res.success) toast.success("Módulo atualizado");
    else toast.error(res.error || "Erro ao atualizar módulo");
  }

  async function onCreateLesson() {
    if (!moduleId) return;
    if (!newLessonTitle.trim()) {
      toast.error("Informe o título da aula");
      return;
    }
    const res = await createLesson({
      moduleId,
      title: newLessonTitle.trim(),
      slug: newLessonSlug.trim() || null,
      description: null, // Removed as it's optional
    });
    if (res.success) {
      toast.success("Aula criada");
      setNewLessonTitle("");
      setNewLessonSlug("");
      const reload = await getModuleWithLessonsBySlugs(
        params.courseSlug,
        params.moduleSlug
      );
      if (reload.success && reload.data) setLessons(reload.data.lessons);
    } else {
      toast.error(res.error || "Erro ao criar aula");
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      setSlug(slugify(title, { lower: true, strict: true }));
    }
  }, [title, slug]);

  // Auto-generate lesson slug from title
  useEffect(() => {
    if (newLessonTitle) {
      const generatedSlug = slugify(newLessonTitle, {
        lower: true,
        strict: true,
      });
      setNewLessonSlug(generatedSlug);
    }
  }, [newLessonTitle]);

  // Handle delete lesson
  const handleDeleteLesson = async () => {
    if (!lessonToDelete || !moduleId) return;

    setDeleting(true);
    try {
      const result = await deleteLesson(lessonToDelete.id, moduleId);
      if (result.success) {
        toast.success("Aula excluída com sucesso");
        // Reload lessons
        const reload = await getModuleWithLessonsBySlugs(
          params.courseSlug,
          params.moduleSlug
        );
        if (reload.success && reload.data) setLessons(reload.data.lessons);
      } else {
        toast.error(result.error || "Erro ao excluir aula");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir aula");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setLessonToDelete(null);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (lesson: { id: string; title: string }) => {
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "basic":
        return <Settings className="h-4 w-4" />;
      case "description":
        return <FileText className="h-4 w-4" />;
      case "lessons":
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "basic":
        return "Informações Básicas";
      case "description":
        return "Descrição";
      case "lessons":
        return "Aulas";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2 border-2 border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background hover:border-primary/50 transition-all duration-200 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <div className="hidden sm:block h-8 w-px bg-border/50" />
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent text-center sm:text-left">
              {loading ? "Carregando módulo..." : `Editar: ${moduleTitle}`}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-2 border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Configurações do Módulo
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gerencie as propriedades e estrutura do módulo
                </p>
              </div>
            </div>

            {/* Mobile Select */}
            <div className="md:hidden">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getTabIcon(activeTab)}
                      <span>{getTabTitle(activeTab)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Informações Básicas
                    </div>
                  </SelectItem>
                  <SelectItem value="description">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Descrição
                    </div>
                  </SelectItem>
                  <SelectItem value="lessons">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Aulas
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-background/50 border border-border/50 p-1 rounded-lg">
                  <TabsTrigger
                    className="min-w-max px-6 py-3 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
                    value="basic"
                  >
                    <Settings className="mr-2 h-4 w-4" /> Básico
                  </TabsTrigger>
                  <TabsTrigger
                    className="min-w-max px-6 py-3 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
                    value="description"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Descrição
                  </TabsTrigger>
                  <TabsTrigger
                    className="min-w-max px-6 py-3 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
                    value="lessons"
                  >
                    <BookOpen className="mr-2 h-4 w-4" /> Aulas
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <Basic
                  title={title}
                  slug={slug}
                  xpReward={xpReward}
                  unlockCriteria={unlockCriteria}
                  isPublic={isPublic}
                  isRequired={isRequired}
                  onTitleChange={setTitle}
                  onSlugChange={setSlug}
                  onXpRewardChange={setXpReward}
                  onUnlockCriteriaChange={setUnlockCriteria}
                  onIsPublicChange={setIsPublic}
                  onIsRequiredChange={setIsRequired}
                  onSave={onSaveModule}
                  saving={saving}
                  loading={loading}
                  moduleId={moduleId}
                  courseId={courseId || undefined}
                />
              </div>
            )}

            {activeTab === "description" && (
              <div className="space-y-4">
                <Description
                  description={description}
                  setDescription={setDescription}
                />
              </div>
            )}

            {activeTab === "lessons" && (
              <div className="space-y-6">
                <Lessons
                  lessons={
                    lessons as { id: string; title: string; slug: string }[]
                  }
                  loading={loading}
                  newLessonTitle={newLessonTitle}
                  setNewLessonTitle={setNewLessonTitle}
                  newLessonSlug={newLessonSlug}
                  setNewLessonSlug={setNewLessonSlug}
                  onCreateLesson={onCreateLesson}
                  onDragEnd={onDragEnd}
                  onSaveOrder={onSaveOrder}
                  saving={saving}
                  moduleId={moduleId}
                  openDeleteDialog={openDeleteDialog}
                  params={params}
                  sensors={sensors}
                  ids={ids}
                  router={router}
                />
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a aula &quot;
                {lessonToDelete?.title}&quot;? Esta ação não pode ser desfeita e
                todos os dados associados serão perdidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteLesson}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Excluindo..." : "Sim, Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
