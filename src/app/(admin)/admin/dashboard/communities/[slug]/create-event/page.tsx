"use client";

import { createCommunityEvent } from "@/actions/communities";
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
import {
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateEventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("VIRTUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxAttendees, setMaxAttendees] = useState<number | undefined>(
    undefined
  );
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [isPublished, setIsPublished] = useState(true);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      // Adicionar campos ao formData
      formData.append("description", description);
      formData.append("isPublished", isPublished ? "on" : "");

      const result = await createCommunityEvent(slug, formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.error || "Evento criado com sucesso!");
        router.push(`/admin/dashboard/communities/${slug}`);
      } else {
        toast.error("Erro inesperado ao criar evento");
      }
    } catch (error) {
      toast.error("Erro ao criar evento");
      console.log("Erro ao criar evento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-start">
          <Link href={`/admin/dashboard/communities/${slug}`}>
            <Button variant="ghost" size="sm">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criar Evento</h1>
          <p className="text-muted-foreground mt-1">
            Organize um evento para sua comunidade
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Coluna Principal */}
          <div className="xl:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Configure as informações principais do evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Workshop de React Hooks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva o evento, agenda, palestrantes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Evento</Label>
                    <Select value={type} onValueChange={setType} name="type">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIRTUAL">Virtual</SelectItem>
                        <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                        <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder={
                        type === "VIRTUAL"
                          ? "Link do Zoom/Meet"
                          : "Endereço do evento"
                      }
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data e Hora */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCalendar className="h-5 w-5" />
                  Data e Hora
                </CardTitle>
                <CardDescription>
                  Defina quando o evento acontecerá
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de Início *</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de Fim</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações Avançadas */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configure limites e preços do evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">
                      Limite de Participantes
                    </Label>
                    <Input
                      id="maxAttendees"
                      name="maxAttendees"
                      type="number"
                      placeholder="Deixe em branco para ilimitado"
                      min="1"
                      max="10000"
                      value={maxAttendees || ""}
                      onChange={(e) =>
                        setMaxAttendees(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00 para gratuito"
                      min="0"
                      step="0.01"
                      value={price || ""}
                      onChange={(e) =>
                        setPrice(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 order-first xl:order-last">
            {/* Configurações */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublished">Publicar Imediatamente</Label>
                    <p className="text-sm text-muted-foreground">
                      Se desmarcado, o evento será salvo como rascunho
                    </p>
                  </div>
                  <Switch
                    id="isPublished"
                    name="isPublished"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? "Criando..."
                      : isPublished
                      ? "Publicar Evento"
                      : "Salvar Rascunho"}
                  </Button>
                  <Link href={`/admin/dashboard/communities/${slug}`}>
                    <Button variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas para um Bom Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong>• Título atrativo:</strong> Seja claro sobre o que os
                  participantes podem esperar
                </div>
                <div>
                  <strong>• Descrição detalhada:</strong> Inclua agenda,
                  palestrantes e benefícios
                </div>
                <div>
                  <strong>• Data e hora claras:</strong> Especifique fuso
                  horário se necessário
                </div>
                <div>
                  <strong>• Local acessível:</strong> Forneça instruções claras
                  para presencial
                </div>
                <div>
                  <strong>• Limite realista:</strong> Considere a capacidade do
                  local/plataforma
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {title && (
                  <div>
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <IconCalendar className="h-3 w-3" />
                      {startDate &&
                        new Date(startDate).toLocaleDateString("pt-BR")}
                      {startTime && ` às ${startTime}`}
                    </div>
                    {location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <IconMapPin className="h-3 w-3" />
                        {location}
                      </div>
                    )}
                    {maxAttendees && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <IconUsers className="h-3 w-3" />
                        Máximo {maxAttendees} participantes
                      </div>
                    )}
                    {price !== undefined && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {price === 0 ? "Gratuito" : `R$ ${price.toFixed(2)}`}
                      </div>
                    )}
                  </div>
                )}
                {!title && (
                  <p className="text-sm text-muted-foreground">
                    Preencha as informações para ver o preview
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
