import {
  AvailableCourse,
  getAvailableCourses,
} from "@/actions/courses/get-available-courses";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface BasicProps {
  title: string;
  slug: string;
  xpReward: number;
  unlockCriteria: string;
  isPublic: boolean;
  isRequired: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onXpRewardChange: (value: number) => void;
  onUnlockCriteriaChange: (value: string) => void;
  onIsPublicChange: (value: boolean) => void;
  onIsRequiredChange: (value: boolean) => void;
  onSave: () => void;
  saving: boolean;
  loading: boolean;
  moduleId: string | null;
  courseId?: string; // ID do curso atual para excluir da lista
}

type UnlockCriteriaType = "none" | "prerequisite" | "xp" | "purchase";

interface UnlockCriteriaData {
  type: UnlockCriteriaType;
  courseIds?: string[];
  minXp?: number;
  required?: boolean;
}

export default function Basic({
  title,
  slug,
  xpReward,
  unlockCriteria,
  isPublic,
  isRequired,
  onTitleChange,
  onSlugChange,
  onXpRewardChange,
  onUnlockCriteriaChange,
  onIsPublicChange,
  onIsRequiredChange,
  onSave,
  saving,
  loading,
  moduleId,
  courseId,
}: BasicProps) {
  const [criteriaType, setCriteriaType] = useState<UnlockCriteriaType>("none");
  const [criteriaData, setCriteriaData] = useState<UnlockCriteriaData>({
    type: "none",
  });

  // Cursos disponíveis
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>(
    []
  );
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Parse existing unlockCriteria on mount
  useEffect(() => {
    if (unlockCriteria) {
      try {
        const parsed = JSON.parse(unlockCriteria);
        setCriteriaType(parsed.type || "none");
        setCriteriaData(parsed);
      } catch {
        setCriteriaType("none");
        setCriteriaData({ type: "none" });
      }
    }
  }, [unlockCriteria]);

  // Load available courses when prerequisite type is selected
  useEffect(() => {
    if (criteriaType === "prerequisite" && availableCourses.length === 0) {
      loadAvailableCourses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaType]);

  const loadAvailableCourses = async () => {
    setCoursesLoading(true);
    try {
      const result = await getAvailableCourses(courseId);
      if (result.success) {
        setAvailableCourses(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Update unlockCriteria when criteria changes
  const updateUnlockCriteria = (newData: Partial<UnlockCriteriaData>) => {
    const updatedData = { ...criteriaData, ...newData };
    setCriteriaData(updatedData);

    // Convert to JSON string and update parent
    const jsonString = JSON.stringify(updatedData);
    onUnlockCriteriaChange(jsonString);
  };

  const handleTypeChange = (type: UnlockCriteriaType) => {
    setCriteriaType(type);
    const newData: UnlockCriteriaData = { type };

    // Set default values based on type
    if (type === "xp") newData.minXp = 100;
    if (type === "purchase") newData.required = true;
    if (type === "prerequisite") newData.courseIds = [];

    updateUnlockCriteria(newData);
  };

  const handleCourseToggle = (courseId: string, checked: boolean) => {
    const currentCourseIds = criteriaData.courseIds || [];
    let newCourseIds: string[];

    if (checked) {
      newCourseIds = [...currentCourseIds, courseId];
    } else {
      newCourseIds = currentCourseIds.filter((id) => id !== courseId);
    }

    updateUnlockCriteria({ courseIds: newCourseIds });
  };

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-2">
        <label
          className="text-sm font-medium text-foreground/90"
          htmlFor="mod-title"
        >
          Título do Módulo
        </label>
        <Input
          id="mod-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors"
          placeholder="Digite o título do módulo"
        />
      </div>
      <div className="lg:col-span-3 space-y-2">
        <label
          className="text-sm font-medium text-foreground/90"
          htmlFor="mod-slug"
        >
          Slug (URL)
        </label>
        <Input
          id="mod-slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors"
          placeholder="modulo-slug"
        />
      </div>
      <div className="lg:col-span-4 space-y-2">
        <label
          className="text-sm font-medium text-foreground/90"
          htmlFor="mod-xp"
        >
          Recompensa de XP
        </label>
        <Input
          id="mod-xp"
          type="number"
          value={xpReward}
          onChange={(e) => onXpRewardChange(Number(e.target.value))}
          className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors"
          min="0"
        />
      </div>

      <div className="lg:col-span-12 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">
            Critérios de Desbloqueio
          </label>
          <Select value={criteriaType} onValueChange={handleTypeChange}>
            <SelectTrigger className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors">
              <SelectValue placeholder="Selecione o tipo de critério" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum critério</SelectItem>
              <SelectItem value="prerequisite">
                Pré-requisitos (cursos)
              </SelectItem>
              <SelectItem value="xp">XP mínimo</SelectItem>
              <SelectItem value="purchase">Compra obrigatória</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional fields based on selected type */}
        {criteriaType === "xp" && (
          <div className="space-y-2">
            <Label
              htmlFor="min-xp"
              className="text-sm font-medium text-foreground/90"
            >
              XP Mínimo Necessário
            </Label>
            <Input
              id="min-xp"
              type="number"
              value={criteriaData.minXp || 100}
              onChange={(e) =>
                updateUnlockCriteria({ minXp: Number(e.target.value) })
              }
              className="border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors w-48"
              min="0"
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">
              Usuário precisa ter pelo menos este valor de XP para acessar o
              módulo
            </p>
          </div>
        )}

        {criteriaType === "purchase" && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="purchase-required"
                checked={criteriaData.required ?? true}
                onCheckedChange={(checked) =>
                  updateUnlockCriteria({ required: checked })
                }
              />
              <Label
                htmlFor="purchase-required"
                className="text-sm font-medium text-foreground/90"
              >
                Compra obrigatória
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Usuário precisa comprar o curso para acessar este módulo
            </p>
          </div>
        )}

        {criteriaType === "prerequisite" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/90">
                Cursos Pré-requisitos
              </Label>
              <p className="text-xs text-muted-foreground">
                Selecione os cursos que devem ser completados antes de acessar
                este módulo
              </p>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-border/50 bg-background/50 focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Courses list */}
            <div className="border-2 border-border/50 rounded-lg bg-background/50 p-4 max-h-64 overflow-y-auto">
              {coursesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Carregando cursos...
                  </span>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? "Nenhum curso encontrado para esta busca"
                      : "Nenhum curso disponível"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={
                          criteriaData.courseIds?.includes(course.id) || false
                        }
                        onCheckedChange={(checked) =>
                          handleCourseToggle(course.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`course-${course.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{course.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {course.level} • {course.language} • {course.slug}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected courses summary */}
            {criteriaData.courseIds && criteriaData.courseIds.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-sm font-medium text-primary mb-2">
                  Cursos selecionados ({criteriaData.courseIds.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {criteriaData.courseIds.map((courseId) => {
                    const course = availableCourses.find(
                      (c) => c.id === courseId
                    );
                    return course ? (
                      <span
                        key={courseId}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary border border-primary/30"
                      >
                        {course.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {criteriaType === "none" && (
          <p className="text-xs text-muted-foreground">
            Este módulo não possui critérios de desbloqueio
          </p>
        )}
      </div>

      <div className="lg:col-span-12">
        <Separator className="my-4" />
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-3">
            <Switch
              id="mod-public"
              checked={isPublic}
              onCheckedChange={onIsPublicChange}
            />
            <label
              htmlFor="mod-public"
              className="text-sm font-medium text-foreground/90"
            >
              Módulo Público
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="mod-required"
              checked={isRequired}
              onCheckedChange={onIsRequiredChange}
            />
            <label
              htmlFor="mod-required"
              className="text-sm font-medium text-foreground/90"
            >
              Módulo Obrigatório
            </label>
          </div>
          <div className="lg:ml-auto">
            <Button
              size="default"
              onClick={onSave}
              disabled={saving || loading || !moduleId}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 w-full lg:w-auto"
            >
              {saving ? "Salvando..." : "Salvar Módulo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
