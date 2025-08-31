"use client";

import { createCommunityPoll } from "@/actions/communities";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowLeft, IconPlus, IconStar, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreatePollPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("SINGLE_CHOICE");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (options.filter((opt) => opt.trim()).length < 2) {
      toast.error("Pelo menos 2 opções são obrigatórias");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("allowMultipleVotes", allowMultipleVotes ? "on" : "off");
      formData.append("isAnonymous", isAnonymous ? "on" : "off");
      formData.append("isPublished", isPublished ? "on" : "off");

      if (endDate) {
        formData.append("endDate", endDate);
      }

      // Adicionar opções
      options
        .filter((opt) => opt.trim())
        .forEach((option) => {
          formData.append("options", option.trim());
        });

      const result = await createCommunityPoll(slug, formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.error || "Enquete criada com sucesso!");
        router.push(`/admin/dashboard/communities/${slug}`);
      } else {
        toast.error("Erro inesperado ao criar enquete");
      }
    } catch (error) {
      console.error("Erro ao criar enquete:", error);
      toast.error("Erro ao criar enquete");
    } finally {
      setIsLoading(false);
    }
  };

  const pollTypes = [
    { value: "SINGLE_CHOICE", label: "Escolha Única" },
    { value: "MULTIPLE_CHOICE", label: "Múltipla Escolha" },
    { value: "RATING", label: "Avaliação" },
    { value: "RANKING", label: "Ranking" },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/dashboard/communities/${slug}`}>
            <Button variant="ghost" size="sm">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Criar Enquete</h1>
            <p className="text-muted-foreground mt-1">
              Crie uma enquete para sua comunidade
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Coluna Principal */}
          <div className="xl:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconStar className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
                <CardDescription>
                  Configure as informações principais da enquete
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Enquete *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título da enquete"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo da enquete"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Enquete</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {pollTypes.map((pollType) => (
                        <SelectItem key={pollType.value} value={pollType.value}>
                          {pollType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Opções da Enquete */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconPlus className="h-5 w-5" />
                  Opções da Enquete
                </CardTitle>
                <CardDescription>
                  Adicione as opções que os membros poderão escolher
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Opção ${index + 1}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {options.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                  >
                    <IconPlus className="h-4 w-4 mr-2" />
                    Adicionar Opção
                  </Button>
                )}

                <p className="text-xs text-muted-foreground">
                  Mínimo: 2 opções | Máximo: 10 opções
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 order-first xl:order-last">
            {/* Configurações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Encerramento</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowMultipleVotes" className="text-sm">
                      Permitir Múltiplos Votos
                    </Label>
                    <Switch
                      id="allowMultipleVotes"
                      checked={allowMultipleVotes}
                      onCheckedChange={setAllowMultipleVotes}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isAnonymous" className="text-sm">
                      Votação Anônima
                    </Label>
                    <Switch
                      id="isAnonymous"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPublished" className="text-sm">
                      Publicar Imediatamente
                    </Label>
                    <Switch
                      id="isPublished"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Enquete"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(`/admin/dashboard/communities/${slug}`)
                  }
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
