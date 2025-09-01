"use client";

import {
  CourseOption,
  getCourses,
  getModulesByCourse,
  ModuleOption,
} from "@/actions/quizzes";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface CourseModuleSelectorProps {
  selectedCourseId: string;
  selectedModuleId: string;
  onCourseChange: (courseId: string) => void;
  onModuleChange: (moduleId: string) => void;
  disabled?: boolean;
}

export default function CourseModuleSelector({
  selectedCourseId,
  selectedModuleId,
  onCourseChange,
  onModuleChange,
  disabled = false,
}: CourseModuleSelectorProps) {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar cursos ao montar o componente
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoadingCourses(true);
      setError(null);
      try {
        const result = await getCourses();
        if (result.success && result.data) {
          setCourses(result.data);
        } else {
          setError(result.error || "Erro ao carregar cursos");
        }
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        setError("Erro interno ao carregar cursos");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // Carregar módulos quando um curso for selecionado
  useEffect(() => {
    if (selectedCourseId && selectedCourseId !== "") {
      const loadModules = async () => {
        setIsLoadingModules(true);
        setError(null);
        try {
          const result = await getModulesByCourse(selectedCourseId);
          if (result.success && result.data) {
            setModules(result.data);
            // Resetar módulo selecionado se não existir na nova lista
            if (!result.data.find((m) => m.id === selectedModuleId)) {
              onModuleChange("");
            }
          } else {
            setError(result.error || "Erro ao carregar módulos");
          }
        } catch (error) {
          console.error("Erro ao carregar módulos:", error);
          setError("Erro interno ao carregar módulos");
        } finally {
          setIsLoadingModules(false);
        }
      };

      loadModules();
    } else {
      setModules([]);
      onModuleChange("");
    }
  }, [selectedCourseId, onModuleChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCourseChange = useCallback(
    (courseId: string) => {
      onCourseChange(courseId);
      // Resetar módulo quando curso mudar
      onModuleChange("");
    },
    [onCourseChange, onModuleChange]
  );

  const handleModuleChange = useCallback(
    (moduleId: string) => {
      onModuleChange(moduleId);
    },
    [onModuleChange]
  );

  // Renderizar condicionalmente baseado no estado
  if (isLoadingCourses) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Curso *</Label>
          <div className="flex items-center gap-2 p-3 border rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando cursos...
          </div>
        </div>
        <div className="space-y-2">
          <Label>Módulo *</Label>
          <div className="p-3 border rounded-md text-muted-foreground">
            Selecione um curso primeiro
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Curso *</Label>
          <div className="p-3 border rounded-md text-red-600">
            Erro: {error}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Módulo *</Label>
          <div className="p-3 border rounded-md text-muted-foreground">
            Erro ao carregar dados
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Seleção de Curso */}
      <div className="space-y-2">
        <Label htmlFor="courseId">Curso *</Label>
        <Select
          value={selectedCourseId || undefined}
          onValueChange={handleCourseChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar curso" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{course.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {course.category.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seleção de Módulo */}
      <div className="space-y-2">
        <Label htmlFor="moduleId">Módulo *</Label>
        <Select
          value={selectedModuleId || undefined}
          onValueChange={handleModuleChange}
          disabled={disabled || !selectedCourseId || isLoadingModules}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar módulo" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingModules ? (
              <SelectItem value="loading" disabled>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando módulos...
                </div>
              </SelectItem>
            ) : selectedCourseId && selectedCourseId !== "" ? (
              modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{module.title}</span>
                    <span className="text-xs text-muted-foreground">
                      Módulo {module.order}
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-course" disabled>
                Selecione um curso primeiro
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
