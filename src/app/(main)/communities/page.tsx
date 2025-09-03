"use client";

import { getCategoriesWithCount, getCommunities } from "@/actions/communities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconBook,
  IconBriefcase,
  IconCalendar,
  IconGlobe,
  IconHeart,
  IconLock,
  IconMessage,
  IconSearch,
  IconStar,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar: string | null;
  cover: string | null;
  type: string;
  level: string;
  isPrivate: boolean;
  isFeatured: boolean;
  isJoined: boolean;
  userRole: string | null;
  memberCount: number;
  postCount: number;
  tags: string[];
  category: {
    id: string;
    name: string;
    icon: string | null;
  } | null;
  createdAt: Date;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("trending");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [communitiesData, categoriesData] = await Promise.all([
          getCommunities(),
          getCategoriesWithCount(),
        ]);
        setCommunities(communitiesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar comunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || community.category?.id === selectedCategory;
    const matchesType =
      selectedType === "all" || community.type === selectedType;
    const matchesLevel =
      selectedLevel === "all" || community.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesType && matchesLevel;
  });

  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return b.postCount - a.postCount;
      case "members":
        return b.memberCount - a.memberCount;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "featured":
        return Number(b.isFeatured) - Number(a.isFeatured);
      default:
        return 0;
    }
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Grid de fundo animado */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,100,66,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,100,66,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-primary/20 rounded-xl w-1/4 mb-8 mx-auto"></div>
            <div className="h-4 bg-primary/20 rounded-xl w-2/3 mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-primary/20 rounded-2xl backdrop-blur-sm border border-primary/20"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid de fundo animado */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(201,100,66,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,100,66,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

      <div className="container mx-auto py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Comunidades</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Conecte-se com outros desenvolvedores, compartilhe conhecimento e
            participe de discussões técnicas
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="mb-8 space-y-6">
          {/* Barra de busca */}
          <div className="relative max-w-md mx-auto">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 h-5 w-5" />
            <Input
              placeholder="Buscar comunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-primary/30 rounded-xl focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-primary/30 rounded-xl">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-primary/30 rounded-xl">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="PUBLIC">Pública</SelectItem>
                <SelectItem value="PRIVATE">Privada</SelectItem>
                <SelectItem value="COURSE_BASED">Baseada em Curso</SelectItem>
                <SelectItem value="PROFESSIONAL">Profissional</SelectItem>
                <SelectItem value="HOBBY">Hobby</SelectItem>
                <SelectItem value="ACADEMIC">Acadêmica</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-48 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-primary/30 rounded-xl">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="BEGINNER">Iniciante</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
                <SelectItem value="ADVANCED">Avançado</SelectItem>
                <SelectItem value="ALL_LEVELS">Todos os Níveis</SelectItem>
                <SelectItem value="EXPERT">Especialista</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-primary/30 rounded-xl">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Mais Ativas</SelectItem>
                <SelectItem value="members">Mais Membros</SelectItem>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="featured">Destaques</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden h-full">
            <CardContent className="p-3 sm:p-6 h-full flex flex-col justify-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl flex-shrink-0">
                  <IconUsersGroup className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold text-primary truncate">
                    {communities.length}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70 truncate">
                    Comunidades
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden h-full">
            <CardContent className="p-3 sm:p-6 h-full flex flex-col justify-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl flex-shrink-0">
                  <IconUsers className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold text-primary truncate">
                    {communities
                      .reduce((sum, c) => sum + c.memberCount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70 truncate">
                    Membros
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden h-full">
            <CardContent className="p-3 sm:p-6 h-full flex flex-col justify-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl flex-shrink-0">
                  <IconMessage className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold text-primary truncate">
                    {communities
                      .reduce((sum, c) => sum + c.postCount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70 truncate">
                    Posts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden h-full">
            <CardContent className="p-3 sm:p-6 h-full flex flex-col justify-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl flex-shrink-0">
                  <IconStar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold text-primary truncate">
                    {communities.filter((c) => c.isFeatured).length}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70 truncate">
                    Destaques
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Comunidades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sortedCommunities.map((community) => (
            <Card
              key={community.id}
              className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 pt-0 h-full flex flex-col"
            >
              {/* Cover Image */}
              {community.cover && (
                <div className="relative h-48 sm:h-40 lg:h-48 bg-primary/80 overflow-hidden rounded-t-2xl flex-shrink-0">
                  <Image
                    src={community.cover}
                    alt={community.name}
                    fill
                    className="object-cover"
                  />
                  {community.isFeatured && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <Badge
                        variant="secondary"
                        className="bg-yellow-400 text-white border-0 animate-pulse text-xs sm:text-sm"
                      >
                        <IconStar className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <CardHeader className="pb-3 px-3 sm:px-4 flex-shrink-0">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/30 flex-shrink-0">
                    {community.avatar ? (
                      <Image
                        src={community.avatar}
                        alt={community.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-sm sm:text-lg bg-primary text-white">
                        {community.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg text-foreground line-clamp-2 leading-tight">
                      {community.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getCommunityTypeIcon(community.type)}
                      <span className="text-xs sm:text-sm text-foreground/70 truncate">
                        {getCommunityTypeLabel(community.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 flex flex-col">
                {community.description && (
                  <CardDescription className="mb-3 sm:mb-4 text-foreground/80 text-sm line-clamp-3 leading-relaxed flex-shrink-0">
                    {community.description}
                  </CardDescription>
                )}

                {/* Tags */}
                {community.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4 flex-shrink-0">
                    {community.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-secondary/50 border-primary/30 text-foreground hover:bg-secondary/70 transition-all duration-300 rounded-lg px-2 py-1 max-w-full truncate"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {community.tags.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-secondary/50 border-primary/30 text-foreground rounded-lg px-2 py-1"
                      >
                        +{community.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Estatísticas */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-foreground/70 mb-3 sm:mb-4 flex-shrink-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="flex items-center bg-primary/10 px-2 py-1 rounded-full min-w-0">
                      <IconUsers className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary flex-shrink-0" />
                      <span className="truncate">
                        {community.memberCount.toLocaleString()}
                      </span>
                    </span>
                    <span className="flex items-center bg-primary/10 px-2 py-1 rounded-full min-w-0">
                      <IconMessage className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary flex-shrink-0" />
                      <span className="truncate">
                        {community.postCount.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/20 border-primary/30 text-foreground rounded-lg w-fit sm:w-auto flex-shrink-0"
                  >
                    {getLevelLabel(community.level)}
                  </Badge>
                </div>

                {/* Botões de Ação */}
                <div className="mt-auto flex-shrink-0 space-y-2">
                  {/* Botão Principal */}
                  <Link
                    href={`/communities/${community.slug}`}
                    className="w-full"
                  >
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white border-0 rounded-xl transform hover:scale-105 transition-all duration-300 text-sm my-4 sm:text-base py-2 sm:py-3"
                      variant={community.isJoined ? "outline" : "default"}
                    >
                      {community.isJoined
                        ? "Ver Comunidade"
                        : "Entrar na Comunidade"}
                    </Button>
                  </Link>

                  {/* Botões de Navegação Rápida */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/communities/${community.slug}/posts`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-lg text-xs py-1.5 transform hover:scale-105 transition-all duration-300"
                      >
                        <IconMessage className="h-3 w-3 mr-1" />
                        Posts
                      </Button>
                    </Link>
                    <Link href={`/communities/${community.slug}/events`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-secondary/50 border-primary/30 hover:bg-secondary/70 text-foreground rounded-lg text-xs py-1.5 transform hover:scale-105 transition-all duration-300"
                      >
                        <IconCalendar className="h-3 w-3 mr-1" />
                        Eventos
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado vazio */}
        {sortedCommunities.length === 0 && (
          <div className="text-center py-12">
            <div className="relative">
              <IconUsersGroup className="h-16 w-16 text-primary/40 mx-auto mb-4" />
              <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping mx-auto"></div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma comunidade encontrada
            </h3>
            <p className="text-foreground/70">
              Tente ajustar os filtros ou criar uma nova comunidade.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
