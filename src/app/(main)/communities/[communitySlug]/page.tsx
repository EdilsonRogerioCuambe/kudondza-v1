"use client";

import { getCommunity } from "@/actions/communities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconArrowLeft,
  IconBook,
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconGlobe,
  IconHeart,
  IconLock,
  IconMessage,
  IconPlus,
  IconSettings,
  IconShare,
  IconStar,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommunityDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  avatar: string | null;
  cover: string | null;
  banner: string | null;
  type: string;
  level: string;
  isPrivate: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  memberCount: number;
  postCount: number;
  eventCount: number;
  viewCount: number;
  tags: string[];
  maxMembers: number | null;
  allowInvites: boolean;
  requireApproval: boolean;
  allowPosts: boolean;
  allowEvents: boolean;
  allowPolls: boolean;
  autoModerate: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  } | null;
  subcategory: {
    id: string;
    name: string;
  } | null;
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  featuredAt: Date | null;
  isJoined: boolean;
  userRole: string | null;
  userStatus: string | null;
  isModerator: boolean;
  notifications: boolean;
  postsCount: number;
  eventsCount: number;
  reputation: number;
}

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await getCommunity(params.communitySlug as string);
        if (response.success && response.community) {
          setCommunity(response.community as unknown as CommunityDetail);
        } else {
          throw new Error(response.error || "Erro ao carregar comunidade");
        }
      } catch (error) {
        console.error("Erro ao carregar comunidade:", error);
        router.push("/communities");
      } finally {
        setLoading(false);
      }
    };

    if (params.communitySlug) {
      fetchCommunity();
    }
  }, [params.communitySlug, router]);

  const getCommunityTypeIcon = (type: string) => {
    switch (type) {
      case "PUBLIC":
        return <IconGlobe className="h-4 w-4" />;
      case "PRIVATE":
        return <IconLock className="h-4 w-4" />;
      case "COURSE_BASED":
        return <IconBook className="h-4 w-4" />;
      case "PROFESSIONAL":
        return <IconBriefcase className="h-4 w-4" />;
      case "HOBBY":
        return <IconHeart className="h-4 w-4" />;
      case "ACADEMIC":
        return <IconBook className="h-4 w-4" />;
      default:
        return <IconUsers className="h-4 w-4" />;
    }
  };

  const getCommunityTypeLabel = (type: string) => {
    switch (type) {
      case "PUBLIC":
        return "Pública";
      case "PRIVATE":
        return "Privada";
      case "COURSE_BASED":
        return "Baseada em Curso";
      case "PROFESSIONAL":
        return "Profissional";
      case "HOBBY":
        return "Hobby";
      case "ACADEMIC":
        return "Acadêmica";
      default:
        return type;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "Iniciante";
      case "INTERMEDIATE":
        return "Intermediário";
      case "ADVANCED":
        return "Avançado";
      case "ALL_LEVELS":
        return "Todos os Níveis";
      case "EXPERT":
        return "Especialista";
      default:
        return level;
    }
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "OWNER":
        return "Proprietário";
      case "ADMIN":
        return "Administrador";
      case "MODERATOR":
        return "Moderador";
      case "MEMBER":
        return "Membro";
      case "GUEST":
        return "Convidado";
      default:
        return "Visitante";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Grid de fundo animado */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,100,66,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,100,66,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-primary/20 rounded-2xl mb-8 backdrop-blur-sm border border-primary/20"></div>
            <div className="h-8 bg-primary/20 rounded-xl w-1/3 mb-4"></div>
            <div className="h-4 bg-primary/20 rounded-xl w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-primary/20 rounded-2xl backdrop-blur-sm border border-primary/20"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center animate-pulse">
              <IconUsers className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-primary rounded-full animate-ping opacity-20"></div>
          </div>
          <h1 className="text-3xl font-bold text-primary">
            Comunidade não encontrada
          </h1>
          <Button
            onClick={() => router.push("/communities")}
            className="bg-primary hover:bg-primary/90 text-white border-0 rounded-xl px-8 py-3 transform hover:scale-105 transition-all duration-300"
          >
            <IconArrowLeft className="h-5 w-5 mr-2" />
            Voltar às Comunidades
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header da Comunidade */}
      <div className="relative">
        {/* Banner */}
        {community.banner && (
          <div className="relative h-64 bg-primary/80 overflow-hidden rounded-t-md">
            <Image
              src={community.banner}
              alt={community.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Card Principal */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-primary/5"></div>
            <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
                {/* Avatar e Verificação */}
                <div className="relative flex-shrink-0">
                  <div className="relative">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white dark:border-stone-800">
                      {community.avatar ? (
                        <Image
                          src={community.avatar}
                          alt={community.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="text-2xl sm:text-3xl bg-primary text-white">
                          {community.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {community.isVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 sm:p-2 animate-pulse">
                        <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Anel de energia */}
                  <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary/30 rounded-full animate-spin-slow"></div>
                </div>

                {/* Informações Principais */}
                <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                  {/* Nome e Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary line-clamp-2 leading-tight">
                      {community.name}
                    </h1>
                    {community.isFeatured && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-400 text-white border-0 animate-pulse w-fit"
                      >
                        <IconStar className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>

                  {/* Descrição */}
                  {community.shortDescription && (
                    <p className="text-base sm:text-lg text-foreground/80 leading-relaxed line-clamp-3">
                      {community.shortDescription}
                    </p>
                  )}

                  {/* Tags */}
                  {community.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {community.tags.slice(0, 4).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-secondary/50 border-primary/30 text-foreground hover:bg-secondary/70 transition-all duration-300 rounded-xl px-2 sm:px-3 py-1 text-xs sm:text-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {community.tags.length > 4 && (
                        <Badge
                          variant="outline"
                          className="bg-secondary/50 border-primary/30 text-foreground rounded-xl px-2 sm:px-3 py-1 text-xs sm:text-sm"
                        >
                          +{community.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Estatísticas */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <span className="flex items-center bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-primary/20 text-xs sm:text-sm text-foreground/70">
                      <IconUsers className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary flex-shrink-0" />
                      <span className="truncate">
                        {community.memberCount.toLocaleString()} membros
                      </span>
                    </span>
                    <span className="flex items-center bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-primary/20 text-xs sm:text-sm text-foreground/70">
                      <IconMessage className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary flex-shrink-0" />
                      <span className="truncate">
                        {community.postCount.toLocaleString()} posts
                      </span>
                    </span>
                    <span className="flex items-center bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-primary/20 text-xs sm:text-sm text-foreground/70">
                      <IconCalendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary flex-shrink-0" />
                      <span className="truncate">
                        {community.eventCount.toLocaleString()} eventos
                      </span>
                    </span>
                    <span className="flex items-center bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-primary/20 text-xs sm:text-sm text-foreground/70">
                      <IconStar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary flex-shrink-0" />
                      <span className="truncate">
                        {community.viewCount.toLocaleString()} visualizações
                      </span>
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-2 sm:gap-3 w-full lg:w-auto lg:min-w-fit">
                  {community.isJoined ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-4 sm:px-6 py-2 sm:py-3 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                      >
                        <IconSettings className="h-4 w-4 mr-2" />
                        Configurações
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-4 sm:px-6 py-2 sm:py-3 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                      >
                        <IconShare className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 rounded-xl px-4 sm:px-6 py-2 sm:py-3 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                      <IconUsersGroup className="h-4 w-4 mr-2" />
                      Entrar na Comunidade
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Tabs para desktop, Select para mobile */}
        <div className="hidden md:block">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6 mb-6"
          >
            <TabsList className="grid w-full grid-cols-5 border border-primary/30 rounded-2xl p-1 backdrop-blur-sm">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-primary/10"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-primary/10"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-primary/10"
              >
                Eventos
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-primary/10"
              >
                Membros
              </TabsTrigger>
              <TabsTrigger
                value="polls"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-primary/10"
              >
                Enquetes
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Select para mobile */}
        <div className="md:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-primary/30 rounded-xl">
              <SelectValue placeholder="Selecione uma seção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Visão Geral</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="events">Eventos</SelectItem>
              <SelectItem value="members">Membros</SelectItem>
              <SelectItem value="polls">Enquetes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="space-y-6">
          {/* Visão Geral */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informações Principais */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Descrição */}
                  {community.description && (
                    <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5"></div>
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-primary">
                          Sobre a Comunidade
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-foreground/80 leading-relaxed">
                          {community.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Estatísticas Detalhadas */}
                  <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-primary">
                        Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="text-center p-3 sm:p-4 bg-primary/10 rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all duration-300 transform hover:scale-105">
                          <div className="text-lg sm:text-2xl font-bold text-primary">
                            {community.memberCount}
                          </div>
                          <div className="text-xs sm:text-sm text-foreground/70">
                            Membros
                          </div>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-primary/10 rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all duration-300 transform hover:scale-105">
                          <div className="text-lg sm:text-2xl font-bold text-primary">
                            {community.postCount}
                          </div>
                          <div className="text-xs sm:text-sm text-foreground/70">
                            Posts
                          </div>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-primary/10 rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all duration-300 transform hover:scale-105">
                          <div className="text-lg sm:text-2xl font-bold text-primary">
                            {community.eventCount}
                          </div>
                          <div className="text-xs sm:text-sm text-foreground/70">
                            Eventos
                          </div>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-primary/10 rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all duration-300 transform hover:scale-105">
                          <div className="text-lg sm:text-2xl font-bold text-primary">
                            {community.viewCount}
                          </div>
                          <div className="text-xs sm:text-sm text-foreground/70">
                            Visualizações
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Posts Recentes */}
                  <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-primary">
                        Posts Recentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-center py-8 text-foreground/60">
                        <div className="relative">
                          <IconMessage className="h-12 w-12 mx-auto mb-4 text-primary/40" />
                          <div className="absolute inset-0 w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
                        </div>
                        <p>
                          Nenhum post ainda. Seja o primeiro a compartilhar
                          algo!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Informações da Comunidade */}
                  <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-primary">
                        Informações
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                        <span className="text-sm text-foreground/70">Tipo</span>
                        <div className="flex items-center gap-2">
                          {getCommunityTypeIcon(community.type)}
                          <span className="text-sm font-medium text-foreground">
                            {getCommunityTypeLabel(community.type)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                        <span className="text-sm text-foreground/70">
                          Nível
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-primary/20 border-primary/30 text-foreground rounded-lg"
                        >
                          {getLevelLabel(community.level)}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2 p-3 bg-secondary/20 rounded-xl border border-primary/20">
                        <span className="text-sm text-foreground/70 flex items-center gap-2">
                          <IconBook className="h-4 w-4 text-primary/60" />
                          Categoria
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-primary/20 border-primary/30 text-foreground rounded-lg px-3 py-1 w-fit"
                        >
                          {community.category?.name || "Sem categoria"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                        <span className="text-sm text-foreground/70">
                          Criada em
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {new Date(community.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      {community.maxMembers && (
                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                          <span className="text-sm text-foreground/70">
                            Limite de membros
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {community.maxMembers}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Criador */}
                  {community.creator && (
                    <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5"></div>
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-primary">Criador</CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl border border-primary/20">
                          <Avatar className="border-2 border-primary/30">
                            {community.creator.image ? (
                              <Image
                                src={community.creator.image}
                                alt={community.creator.name}
                                fill
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-white">
                                {community.creator.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {community.creator.name}
                            </p>
                            <p className="text-sm text-foreground/70">
                              Proprietário
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Status do Usuário */}
                  {community.isJoined && (
                    <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5"></div>
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-primary">
                          Seu Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                          <span className="text-sm text-foreground/70">
                            Cargo
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-primary/20 border-primary/30 text-foreground rounded-lg"
                          >
                            {getRoleLabel(community.userRole)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                          <span className="text-sm text-foreground/70">
                            Reputação
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {community.reputation}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                          <span className="text-sm text-foreground/70">
                            Posts
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {community.postsCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-primary/20">
                          <span className="text-sm text-foreground/70">
                            Eventos
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {community.eventsCount}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          {activeTab === "posts" && (
            <div className="space-y-6">
              <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-primary">
                      Posts da Comunidade
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-4 py-2 transform hover:scale-105 transition-all duration-300"
                      >
                        <Link href={`/communities/${community.slug}/posts`}>
                          Ver Todos os Posts
                        </Link>
                      </Button>
                      {community.allowPosts && (
                        <Button className="bg-primary hover:bg-primary/90 text-white border-0 rounded-xl px-4 py-2 transform hover:scale-105 transition-all duration-300">
                          <IconPlus className="h-4 w-4 mr-2" />
                          Novo Post
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center py-12 text-foreground/60">
                    <div className="relative">
                      <IconMessage className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                      <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-foreground">
                      Nenhum post ainda
                    </h3>
                    <p>
                      Seja o primeiro a compartilhar conhecimento nesta
                      comunidade!
                    </p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-6 py-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <Link href={`/communities/${community.slug}/posts`}>
                          Ver Posts da Comunidade
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Eventos */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-primary">
                      Eventos da Comunidade
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-4 py-2 transform hover:scale-105 transition-all duration-300"
                      >
                        <Link href={`/communities/${community.slug}/events`}>
                          Ver Todos os Eventos
                        </Link>
                      </Button>
                      {community.allowEvents && (
                        <Button className="bg-primary hover:bg-primary/90 text-white border-0 rounded-xl px-4 py-2 transform hover:scale-105 transition-all duration-300">
                          <IconPlus className="h-4 w-4 mr-2" />
                          Novo Evento
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center py-12 text-foreground/60">
                    <div className="relative">
                      <IconCalendar className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                      <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-foreground">
                      Nenhum evento agendado
                    </h3>
                    <p>Organize o primeiro evento da comunidade!</p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-6 py-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <Link href={`/communities/${community.slug}/events`}>
                          Ver Eventos da Comunidade
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Membros */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-primary">
                      Membros da Comunidade
                    </CardTitle>
                    <Button
                      variant="outline"
                      asChild
                      className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-4 py-2 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                    >
                      <Link href={`/communities/${community.slug}/members`}>
                        Ver Todos os Membros
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center py-12 text-foreground/60">
                    <div className="relative">
                      <IconUsers className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                      <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-foreground">
                      Lista de membros
                    </h3>
                    <p>Visualize todos os membros desta comunidade.</p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-6 py-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <Link href={`/communities/${community.slug}/members`}>
                          Ver Membros da Comunidade
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enquetes */}
          {activeTab === "polls" && (
            <div className="space-y-6">
              <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <CardHeader className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-primary">
                      Enquetes da Comunidade
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-4 py-2 transform hover:scale-105 transition-all duration-300"
                      >
                        <Link href={`/communities/${community.slug}/polls`}>
                          Ver Todas as Enquetes
                        </Link>
                      </Button>
                      {community.allowPolls && (
                        <Button className="bg-primary hover:bg-primary/90 text-white border-0 rounded-xl px-4 py-2 transform hover:scale-105 transition-all duration-300">
                          <IconPlus className="h-4 w-4 mr-2" />
                          Nova Enquete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center py-12 text-foreground/60">
                    <div className="relative">
                      <IconStar className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                      <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-foreground">
                      Nenhuma enquete ativa
                    </h3>
                    <p>Crie a primeira enquete para engajar a comunidade!</p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-xl px-6 py-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <Link href={`/communities/${community.slug}/polls`}>
                          Ver Enquetes da Comunidade
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
