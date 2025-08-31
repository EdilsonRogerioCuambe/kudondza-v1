"use client";

import { getCategories } from "@/actions/categories/get-categories";
import { getSubcategories } from "@/actions/categories/subcategories/get-subcategories";
import {
  getCommunityForEdit,
  updateCommunity,
  validateCommunitySlug,
} from "@/actions/communities";
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function EditCommunityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [slugValidation, setSlugValidation] = useState<{
    available: boolean;
    error: string | null;
  } | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [description, setDescription] = useState("");

  // Estados para upload de imagens
  const [avatarMode, setAvatarMode] = useState<"url" | "upload">("url");
  const [coverMode, setCoverMode] = useState<"url" | "upload">("url");
  const [bannerMode, setBannerMode] = useState<"url" | "upload">("url");
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [bannerProgress, setBannerProgress] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // Estados para categorias
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [subcategories, setSubcategories] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("none");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("none");
  const [_slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");

  // Estados para configurações
  const [isPrivate, setIsPrivate] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);
  const [allowInvites, setAllowInvites] = useState(true);
  const [allowPosts, setAllowPosts] = useState(true);
  const [allowEvents, setAllowEvents] = useState(true);
  const [allowPolls, setAllowPolls] = useState(true);
  const [autoModerate, setAutoModerate] = useState(false);
  const [type, setType] = useState("PUBLIC");
  const [level, setLevel] = useState("ALL_LEVELS");
  const [maxMembers, setMaxMembers] = useState<number | undefined>(undefined);
  const [shortDescription, setShortDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleSlugValidation = async (slug: string) => {
    if (slug.length < 3) {
      setSlugValidation(null);
      return;
    }

    const result = await validateCommunitySlug(slug);
    setSlugValidation(result);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Carregar dados iniciais
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Carregar categorias
        const categoriesResult = await getCategories({
          page: 1,
          limit: 100,
          sortBy: "name",
          sortOrder: "asc",
        });
        if (isMounted && categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data.categories);
        }

        // Carregar dados da comunidade
        const communityResult = await getCommunityForEdit(
          window.location.pathname.split("/")[4]
        );
        if (isMounted && communityResult.success && communityResult.community) {
          const community = communityResult.community;
          console.log("📋 Carregando dados da comunidade:", community);

          // Definir todos os estados de uma vez para evitar re-renders desnecessários
          const updates = {
            name: community.name,
            slug: community.slug,
            shortDescription: community.shortDescription || "",
            description: community.description || "",
            tags: community.tags || [],
            type: community.type,
            level: community.level,
            maxMembers: community.maxMembers || undefined,
            selectedCategoryId: community.categoryId || "none",
            selectedSubcategoryId: community.subcategoryId || "none",
            isPrivate: community.isPrivate,
            requireApproval: community.requireApproval,
            allowInvites: community.allowInvites,
            allowPosts: community.allowPosts,
            allowEvents: community.allowEvents,
            allowPolls: community.allowPolls,
            autoModerate: community.autoModerate,
            seoTitle: community.seoTitle || "",
            seoDescription: community.seoDescription || "",
            avatarUrl: community.avatar || "",
            coverUrl: community.cover || "",
            bannerUrl: community.banner || "",
          };

          // Aplicar todas as atualizações de estado
          setName(updates.name);
          setSlug(updates.slug);
          setShortDescription(updates.shortDescription);
          setDescription(updates.description);
          setTags(updates.tags);
          setType(updates.type);
          setLevel(updates.level);
          setMaxMembers(updates.maxMembers);
          setSelectedCategoryId(updates.selectedCategoryId);
          setSelectedSubcategoryId(updates.selectedSubcategoryId);
          setIsPrivate(updates.isPrivate);
          setRequireApproval(updates.requireApproval);
          setAllowInvites(updates.allowInvites);
          setAllowPosts(updates.allowPosts);
          setAllowEvents(updates.allowEvents);
          setAllowPolls(updates.allowPolls);
          setAutoModerate(updates.autoModerate);
          setSeoTitle(updates.seoTitle);
          setSeoDescription(updates.seoDescription);
          setAvatarUrl(updates.avatarUrl);
          setCoverUrl(updates.coverUrl);
          setBannerUrl(updates.bannerUrl);

          console.log("✅ Estados atualizados com sucesso");
          setIsDataLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Erro ao carregar dados:", error);
          toast.error("Erro ao carregar dados da comunidade");
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Efeito para carregar subcategorias quando categoria muda
  useEffect(() => {
    let isMounted = true;

    const loadSubs = async () => {
      if (selectedCategoryId && selectedCategoryId !== "none") {
        try {
          const subcategoriesResult = await getSubcategories(
            selectedCategoryId
          );
          if (
            isMounted &&
            subcategoriesResult.success &&
            subcategoriesResult.data
          ) {
            setSubcategories(subcategoriesResult.data);

            // Verificar se a subcategoria atual ainda é válida para a nova categoria
            const subcategoryStillValid = subcategoriesResult.data.some(
              (sub) => sub.id === selectedSubcategoryId
            );

            // Só resetar se a subcategoria não for válida E se não estivermos no carregamento inicial
            if (
              !subcategoryStillValid &&
              selectedSubcategoryId !== "none" &&
              isDataLoaded
            ) {
              console.log(
                "🔄 Resetando subcategoria - não é válida para a nova categoria"
              );
              setSelectedSubcategoryId("none");
            }
          }
        } catch (error) {
          if (isMounted) {
            console.error("Erro ao carregar subcategorias:", error);
          }
        }
      } else if (isMounted) {
        setSubcategories([]);
        // Só resetar subcategoria se não estivermos no carregamento inicial
        if (selectedSubcategoryId !== "none") {
          setSelectedSubcategoryId("none");
        }
      }
    };

    loadSubs();

    return () => {
      isMounted = false;
    };
  }, [selectedCategoryId, selectedSubcategoryId, isDataLoaded]); // Incluído isDataLoaded para controlar quando resetar

  // Função para upload de arquivo
  const uploadFile = useCallback(
    (
      file: File,
      onProgress: (progress: number) => void,
      onSuccess: (url: string) => void
    ) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tempUpload", "true");

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      };

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success) {
            onProgress(100);
            const openUrl = json.presignedUrl || json.fileUrl;
            onSuccess(openUrl);
            toast.success("Upload concluído");
          } else {
            throw new Error(json.error || "Falha no upload");
          }
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Erro ao enviar arquivo";
          toast.error(message);
        }
      };

      xhr.onerror = () => {
        toast.error("Erro de rede durante upload");
      };

      xhr.open("POST", "/api/s3/upload");
      xhr.send(formData);
    },
    []
  );

  // Componente de dropzone para upload
  const FieldDropzone = ({
    accept,
    onFiles,
    placeholder,
  }: {
    accept: Record<string, string[]>;
    onFiles: (files: File[]) => void;
    placeholder: string;
  }) => {
    const onDropLocal = useCallback(
      (files: File[]) => {
        if (!files?.length) return;
        onFiles(files);
      },
      [onFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: onDropLocal,
      multiple: false,
      accept,
    });

    return (
      <div
        {...getRootProps({
          className:
            `flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center transition-colors w-full ` +
            `${
              isDragActive ? "bg-accent/40 border-accent" : "hover:bg-accent/30"
            }`,
        })}
      >
        <input {...getInputProps()} />
        <IconUpload className="h-5 w-5 text-muted-foreground" />
        <div className="text-sm">{placeholder}</div>
        <div className="text-xs text-muted-foreground">
          Arraste e solte ou clique
        </div>
      </div>
    );
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      // Adicionar tags ao formData
      tags.forEach((tag) => {
        formData.append("tags", tag);
      });

      // Adicionar descrição markdown
      formData.append("description", description);

      // Adicionar URLs das imagens
      if (avatarUrl) formData.append("avatar", avatarUrl);
      if (coverUrl) formData.append("cover", coverUrl);
      if (bannerUrl) formData.append("banner", bannerUrl);

      // Adicionar categoria e subcategoria
      if (selectedCategoryId && selectedCategoryId !== "none")
        formData.append("categoryId", selectedCategoryId);
      if (selectedSubcategoryId && selectedSubcategoryId !== "none")
        formData.append("subcategoryId", selectedSubcategoryId);

      // Adicionar configurações
      formData.append("isPrivate", isPrivate ? "on" : "");
      formData.append("requireApproval", requireApproval ? "on" : "");
      formData.append("allowInvites", allowInvites ? "on" : "");
      formData.append("allowPosts", allowPosts ? "on" : "");
      formData.append("allowEvents", allowEvents ? "on" : "");
      formData.append("allowPolls", allowPolls ? "on" : "");
      formData.append("autoModerate", autoModerate ? "on" : "");

      const result = await updateCommunity(slug, formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success && result.community) {
        toast.success(result.message || "Comunidade atualizada com sucesso!");
        router.push(`/admin/dashboard/communities/${result.community.slug}`);
      } else {
        toast.error("Erro inesperado ao atualizar comunidade");
      }
    } catch {
      toast.error("Erro ao atualizar comunidade");
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold tracking-tight">
              Editar Comunidade
            </h1>
            <p className="text-muted-foreground mt-1">
              Modifique as informações da sua comunidade
            </p>
          </div>
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
                  Configure as informações principais da comunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Comunidade *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: React Developers BR"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="react-developers-br"
                      required
                      value={slug}
                      onChange={(e) => {
                        const newSlug = e.target.value;
                        setSlug(newSlug);
                        setSlugManuallyEdited(true);
                        handleSlugValidation(newSlug);
                      }}
                    />
                    {slugValidation && (
                      <p
                        className={`text-sm ${
                          slugValidation.available
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {slugValidation.error || "Slug disponível"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descrição Curta</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    placeholder="Uma breve descrição da comunidade"
                    maxLength={200}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição Completa (Markdown)</Label>
                  <ByteMDEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Descreva o propósito e objetivos da comunidade em detalhes..."
                    className="min-h-[200px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
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
                      disabled={tags.length >= 10}
                      title="Adicionar tag"
                    >
                      <IconPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
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
                </div>
              </CardContent>
            </Card>

            {/* Mídia e Imagens */}
            <Card>
              <CardHeader>
                <CardTitle>Mídia e Imagens</CardTitle>
                <CardDescription>
                  Adicione imagens para personalizar sua comunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="space-y-2">
                  <Label>Avatar da Comunidade</Label>
                  <div className="flex items-center gap-4 py-1">
                    <RadioGroup
                      value={avatarMode}
                      onValueChange={(v) =>
                        setAvatarMode(v as "url" | "upload")
                      }
                      className="flex flex-row gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="url" id="avatar-mode-url" />
                        <Label htmlFor="avatar-mode-url">URL</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="upload"
                          id="avatar-mode-upload"
                        />
                        <Label htmlFor="avatar-mode-upload">Upload</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {avatarMode === "url" ? (
                    <Input
                      placeholder="URL do avatar (emoji ou imagem)"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                  ) : (
                    <FieldDropzone
                      accept={{ "image/*": [] }}
                      placeholder="Solte o avatar da comunidade aqui"
                      onFiles={(files) => {
                        const file = files[0];
                        if (!file) return;
                        setAvatarProgress(1);
                        uploadFile(file, setAvatarProgress, setAvatarUrl);
                      }}
                    />
                  )}
                  {avatarMode === "upload" &&
                    avatarProgress > 0 &&
                    avatarProgress < 100 && (
                      <div className="pt-1">
                        <Progress value={avatarProgress} />
                      </div>
                    )}
                </div>

                {/* Cover */}
                <div className="space-y-2">
                  <Label>Imagem de Capa</Label>
                  <div className="flex items-center gap-4 py-1">
                    <RadioGroup
                      value={coverMode}
                      onValueChange={(v) => setCoverMode(v as "url" | "upload")}
                      className="flex flex-row gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="url" id="cover-mode-url" />
                        <Label htmlFor="cover-mode-url">URL</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="upload" id="cover-mode-upload" />
                        <Label htmlFor="cover-mode-upload">Upload</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {coverMode === "url" ? (
                    <Input
                      placeholder="URL da imagem de capa"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                    />
                  ) : (
                    <FieldDropzone
                      accept={{ "image/*": [] }}
                      placeholder="Solte a imagem de capa aqui"
                      onFiles={(files) => {
                        const file = files[0];
                        if (!file) return;
                        setCoverProgress(1);
                        uploadFile(file, setCoverProgress, setCoverUrl);
                      }}
                    />
                  )}
                  {coverMode === "upload" &&
                    coverProgress > 0 &&
                    coverProgress < 100 && (
                      <div className="pt-1">
                        <Progress value={coverProgress} />
                      </div>
                    )}
                </div>

                {/* Banner */}
                <div className="space-y-2">
                  <Label>Banner da Comunidade</Label>
                  <div className="flex items-center gap-4 py-1">
                    <RadioGroup
                      value={bannerMode}
                      onValueChange={(v) =>
                        setBannerMode(v as "url" | "upload")
                      }
                      className="flex flex-row gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="url" id="banner-mode-url" />
                        <Label htmlFor="banner-mode-url">URL</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="upload"
                          id="banner-mode-upload"
                        />
                        <Label htmlFor="banner-mode-upload">Upload</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {bannerMode === "url" ? (
                    <Input
                      placeholder="URL do banner da comunidade"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                    />
                  ) : (
                    <FieldDropzone
                      accept={{ "image/*": [] }}
                      placeholder="Solte o banner da comunidade aqui"
                      onFiles={(files) => {
                        const file = files[0];
                        if (!file) return;
                        setBannerProgress(1);
                        uploadFile(file, setBannerProgress, setBannerUrl);
                      }}
                    />
                  )}
                  {bannerMode === "upload" &&
                    bannerProgress > 0 &&
                    bannerProgress < 100 && (
                      <div className="pt-1">
                        <Progress value={bannerProgress} />
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Configure o tipo e nível da comunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Comunidade</Label>
                    <Select value={type} onValueChange={setType} name="type">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Pública</SelectItem>
                        <SelectItem value="PRIVATE">Privada</SelectItem>
                        <SelectItem value="PROFESSIONAL">
                          Profissional
                        </SelectItem>
                        <SelectItem value="HOBBY">Hobby</SelectItem>
                        <SelectItem value="ACADEMIC">Acadêmica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nível</Label>
                    <Select value={level} onValueChange={setLevel} name="level">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Iniciante</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediário
                        </SelectItem>
                        <SelectItem value="ADVANCED">Avançado</SelectItem>
                        <SelectItem value="ALL_LEVELS">
                          Todos os Níveis
                        </SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Limite de Membros</Label>
                  <Input
                    id="maxMembers"
                    name="maxMembers"
                    type="number"
                    placeholder="Deixe em branco para ilimitado"
                    min="1"
                    max="10000"
                    value={maxMembers || ""}
                    onChange={(e) =>
                      setMaxMembers(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Categoria</Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={(value) => {
                        setSelectedCategoryId(value);
                        setSelectedSubcategoryId("none");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma categoria</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategoryId">Subcategoria</Label>
                    <Select
                      value={selectedSubcategoryId}
                      onValueChange={setSelectedSubcategoryId}
                      disabled={
                        !selectedCategoryId || selectedCategoryId === "none"
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma subcategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          Nenhuma subcategoria
                        </SelectItem>
                        {subcategories.map((subcategory) => (
                          <SelectItem
                            key={subcategory.id}
                            value={subcategory.id}
                          >
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                  Configure informações para otimização de busca
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">Título SEO</Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    placeholder="Título otimizado para busca"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Descrição SEO</Label>
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    placeholder="Descrição otimizada para busca"
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 order-first xl:order-last">
            {/* Configurações de Privacidade */}
            <Card>
              <CardHeader>
                <CardTitle>Privacidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comunidade Privada</Label>
                    <p className="text-sm text-muted-foreground">
                      Apenas membros podem ver o conteúdo
                    </p>
                  </div>
                  <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Requer Aprovação</Label>
                    <p className="text-sm text-muted-foreground">
                      Novos membros precisam ser aprovados
                    </p>
                  </div>
                  <Switch
                    checked={requireApproval}
                    onCheckedChange={setRequireApproval}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Convites</Label>
                    <p className="text-sm text-muted-foreground">
                      Membros podem convidar outros
                    </p>
                  </div>
                  <Switch
                    checked={allowInvites}
                    onCheckedChange={setAllowInvites}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Conteúdo */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Posts</Label>
                    <p className="text-sm text-muted-foreground">
                      Membros podem criar posts
                    </p>
                  </div>
                  <Switch
                    checked={allowPosts}
                    onCheckedChange={setAllowPosts}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Eventos</Label>
                    <p className="text-sm text-muted-foreground">
                      Membros podem criar eventos
                    </p>
                  </div>
                  <Switch
                    checked={allowEvents}
                    onCheckedChange={setAllowEvents}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Enquetes</Label>
                    <p className="text-sm text-muted-foreground">
                      Membros podem criar enquetes
                    </p>
                  </div>
                  <Switch
                    checked={allowPolls}
                    onCheckedChange={setAllowPolls}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Moderação Automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Posts precisam de aprovação
                    </p>
                  </div>
                  <Switch
                    checked={autoModerate}
                    onCheckedChange={setAutoModerate}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Link href={`/admin/dashboard/communities/${slug}`}>
                    <Button variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
