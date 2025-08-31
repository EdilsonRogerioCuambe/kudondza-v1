"use client";

import { createCommunityPost } from "@/actions/communities";
import ByteMDEditor from "@/components/byte-md-editor";
import { Badge } from "@/components/ui/badge";
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
import { IconArrowLeft, IconPlus, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreatePostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("TEXT");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Título e conteúdo são obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("type", type);
      formData.append("isPinned", isPinned ? "on" : "off");
      formData.append("isAnnouncement", isAnnouncement ? "on" : "off");
      formData.append("allowComments", allowComments ? "on" : "off");
      formData.append("isPublished", isPublished ? "on" : "off");

      // Adicionar tags
      tags.forEach((tag) => {
        formData.append("tags", tag);
      });

      const result = await createCommunityPost(slug, formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.message || "Post criado com sucesso!");
        router.push(`/admin/dashboard/communities/${slug}`);
      } else {
        toast.error("Erro inesperado ao criar post");
      }
    } catch (error) {
      console.error("Erro ao criar post:", error);
      toast.error("Erro ao criar post");
    } finally {
      setIsLoading(false);
    }
  };

  const postTypes = [
    { value: "TEXT", label: "Texto" },
    { value: "QUESTION", label: "Pergunta" },
    { value: "TIP", label: "Dica" },
    { value: "PROJECT_SHARE", label: "Compartilhar Projeto" },
    { value: "ACHIEVEMENT", label: "Conquista" },
    { value: "COURSE_COMPLETION", label: "Conclusão de Curso" },
    { value: "BADGE_EARNED", label: "Badge Conquistado" },
  ];

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
          <h1 className="text-3xl font-bold tracking-tight">Criar Post</h1>
          <p className="text-muted-foreground mt-1">
            Compartilhe suas ideias com a comunidade
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Coluna Principal */}
          <div className="xl:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Post</CardTitle>
                <CardDescription>
                  Configure as informações principais do seu post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Digite o título do seu post..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Post</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {postTypes.map((postType) => (
                        <SelectItem key={postType.value} value={postType.value}>
                          {postType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Conteúdo */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo *</CardTitle>
                <CardDescription>
                  Escreva o conteúdo do seu post usando Markdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ByteMDEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Escreva o conteúdo do seu post aqui... Use Markdown para formatação."
                  className="min-h-[400px]"
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Adicione tags para ajudar outros a encontrar seu post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={tags.length >= 10 || !newTag.trim()}
                    title="Adicionar tag"
                  >
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                        title="Remover tag"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {tags.length}/10 tags
                </p>
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
                      Se desmarcado, o post será salvo como rascunho
                    </p>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPinned">Fixar Post</Label>
                    <p className="text-sm text-muted-foreground">
                      Posts fixados aparecem no topo
                    </p>
                  </div>
                  <Switch
                    id="isPinned"
                    checked={isPinned}
                    onCheckedChange={setIsPinned}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isAnnouncement">Anúncio</Label>
                    <p className="text-sm text-muted-foreground">
                      Marcar como anúncio oficial
                    </p>
                  </div>
                  <Switch
                    id="isAnnouncement"
                    checked={isAnnouncement}
                    onCheckedChange={setIsAnnouncement}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowComments">Permitir Comentários</Label>
                    <p className="text-sm text-muted-foreground">
                      Usuários podem comentar no post
                    </p>
                  </div>
                  <Switch
                    id="allowComments"
                    checked={allowComments}
                    onCheckedChange={setAllowComments}
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
                      ? "Publicar Post"
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
                <CardTitle>Dicas para um Bom Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong>• Título claro:</strong> Seja específico sobre o que
                  você está compartilhando
                </div>
                <div>
                  <strong>• Conteúdo estruturado:</strong> Use cabeçalhos,
                  listas e formatação para melhor legibilidade
                </div>
                <div>
                  <strong>• Tags relevantes:</strong> Ajude outros a encontrar
                  seu conteúdo
                </div>
                <div>
                  <strong>• Seja respeitoso:</strong> Mantenha um tom
                  construtivo e acolhedor
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
