"use client";

import {
  getCategoriesWithCount,
  getCommunities,
  getRecentPosts,
  getTopMembers,
  getUpcomingEventsAll,
  getUserCommunityStats,
  joinCommunity,
} from "@/actions/communities";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconActivity,
  IconAward,
  IconCalendar,
  IconDots,
  IconEdit,
  IconHeart,
  IconLock,
  IconMessage,
  IconPlus,
  IconSearch,
  IconStar,
  IconTrash,
  IconTrendingUp,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CommunityWithStats {
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

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  community: {
    name: string;
  };
  metadata?: {
    tags?: string[];
  };
  reactionCount: number;
  commentCount: number;
  createdAt: Date;
}

interface Event {
  id: string;
  title: string;
  startDate: Date;
  location: string | null;
  type: string;
  attendeeCount: number;
  maxAttendees: number | null;
  isRegistered: boolean;
}

interface Member {
  user: {
    name: string;
  };
  role: string;
  level: string;
  community: {
    name: string;
  };
  postsCount: number;
  reputation: number;
}

interface UserStats {
  communitiesJoined: number;
  eventsAttended: number;
  postsCreated: number;
  reputation: number;
}

export default function CommunitiesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [allCommunitiesData, setAllCommunitiesData] = useState<
    CommunityWithStats[]
  >([]);
  const [filteredCommunities, setFilteredCommunities] = useState<
    CommunityWithStats[]
  >([]);
  const [featuredCommunities, setFeaturedCommunities] = useState<
    CommunityWithStats[]
  >([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [topMembers, setTopMembers] = useState<Member[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [_userStats, setUserStats] = useState<UserStats | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  // Calcular número de filtros ativos
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedLevel !== "all" ? 1 : 0) +
    (selectedType !== "all" ? 1 : 0) +
    (showOnlyFeatured ? 1 : 0);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        const [communities, posts, events, members, categoriesData, stats] =
          await Promise.all([
            getCommunities({ limit: 20 }),
            getRecentPosts(),
            getUpcomingEventsAll(),
            getTopMembers(),
            getCategoriesWithCount(),
            getUserCommunityStats(),
          ]);

        setAllCommunitiesData(communities);
        setFilteredCommunities(communities);
        const featured = communities.filter((c) => c.isFeatured);
        setFeaturedCommunities(featured);
        setRecentPosts(posts);
        setUpcomingEvents(events);
        setTopMembers(members);
        setCategories(categoriesData);
        setUserStats(stats);
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleJoinCommunity = async (communityId: string) => {
    try {
      const result = await joinCommunity(communityId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Você entrou na comunidade!");
        // Recarregar comunidades para atualizar o estado
        const updatedCommunities = await getCommunities({ limit: 20 });
        setAllCommunitiesData(updatedCommunities);
        applyFilters(updatedCommunities);
      }
    } catch (error) {
      console.error("Erro ao entrar na comunidade:", error);
      toast.error("Erro ao entrar na comunidade");
    }
  };

  const handleEditCommunity = (community: CommunityWithStats) => {
    // Redirecionar para a página de edição
    router.push(`/admin/dashboard/communities/${community.slug}/edit`);
  };

  const handleDeleteCommunity = async (community: CommunityWithStats) => {
    if (
      !confirm(
        `Tem certeza que deseja deletar a comunidade "${community.name}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    try {
      // TODO: Implementar deleteCommunity action
      toast.error(
        "Funcionalidade de deletar comunidade será implementada em breve"
      );
    } catch (error) {
      console.error("Erro ao deletar comunidade:", error);
      toast.error("Erro ao deletar comunidade");
    }
  };

  // Função para aplicar filtros
  const applyFilters = (
    communitiesToFilter: CommunityWithStats[] = allCommunitiesData
  ) => {
    let filtered = communitiesToFilter;

    // Filtro por busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(search) ||
          community.description?.toLowerCase().includes(search) ||
          community.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // Filtro por categoria
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (community) => community.category?.id === selectedCategory
      );
    }

    // Filtro por nível
    if (selectedLevel && selectedLevel !== "all") {
      filtered = filtered.filter(
        (community) => community.level === selectedLevel
      );
    }

    // Filtro por tipo
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(
        (community) => community.type === selectedType
      );
    }

    // Filtro por destaque
    if (showOnlyFeatured) {
      filtered = filtered.filter((community) => community.isFeatured);
    }

    setFilteredCommunities(filtered);
  };

  // Aplicar filtros quando qualquer filtro mudar
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedType,
    showOnlyFeatured,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedType("all");
    setShowOnlyFeatured(false);
  };

  const renderCommunityAvatar = (
    community: CommunityWithStats,
    size: "sm" | "md" | "lg"
  ) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
    };

    if (community.avatar) {
      return (
        <Image
          src={community.avatar}
          alt={`Avatar da comunidade ${community.name}`}
          width={64}
          height={64}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          unoptimized
        />
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg`}
      >
        {community.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunidades</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e participe de comunidades
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link href="/admin/dashboard/communities/create">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
              <IconPlus className="h-4 w-4 mr-2" />
              Criar Comunidade
            </Button>
          </Link>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar comunidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-auto">
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

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Níveis</SelectItem>
                  <SelectItem value="BEGINNER">Iniciante</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
                  <SelectItem value="ADVANCED">Avançado</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                  <SelectItem value="ALL_LEVELS">Todos os Níveis</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="PUBLIC">Pública</SelectItem>
                  <SelectItem value="PRIVATE">Privada</SelectItem>
                  <SelectItem value="PROFESSIONAL">Profissional</SelectItem>
                  <SelectItem value="HOBBY">Hobby</SelectItem>
                  <SelectItem value="ACADEMIC">Acadêmica</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showOnlyFeatured ? "default" : "outline"}
                onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                className="w-full sm:w-auto"
              >
                <IconStar className="h-4 w-4 mr-2" />
                Em Destaque
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full sm:w-auto"
                >
                  Limpar ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Principal - 2 Colunas */}
      <div className="grid gap-6 xl:grid-cols-3 max-w-full overflow-hidden">
        {/* Coluna Principal - Comunidades */}
        <div className="xl:col-span-2 space-y-6 min-w-0">
          {/* Comunidades em Destaque */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconStar className="h-5 w-5 text-yellow-600" />
                Comunidades em Destaque
              </CardTitle>
              <CardDescription>
                As comunidades mais ativas e populares
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredCommunities.map((community) => (
                <div
                  key={community.id}
                  className="p-3 sm:p-4 rounded-lg border bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow min-w-0"
                >
                  <div className="flex flex-col gap-4 min-w-0">
                    {/* Header com Avatar e Informações Básicas */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 min-w-0">
                      {renderCommunityAvatar(community, "md")}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold text-base sm:text-lg truncate">
                            {community.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            {community.isPrivate && (
                              <IconLock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            {community.isJoined && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-muted dark:text-foreground text-xs"
                              >
                                Participando
                              </Badge>
                            )}
                            {community.userRole === "MODERATOR" && (
                              <Badge
                                variant="default"
                                className="bg-purple-100 text-purple-800 dark:bg-muted dark:text-foreground text-xs"
                              >
                                Moderador
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {community.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <IconUsers className="h-3 w-3 sm:h-4 sm:w-4" />
                            {community.memberCount.toLocaleString()} membros
                          </span>
                          <span className="flex items-center gap-1">
                            <IconMessage className="h-3 w-3 sm:h-4 sm:w-4" />
                            {community.postCount} posts
                          </span>
                          <span className="flex items-center gap-1">
                            <IconActivity className="h-3 w-3 sm:h-4 sm:w-4" />
                            Ativo
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {community.tags
                            .slice(0, 3)
                            .map((tag: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:bg-muted dark:text-foreground"
                              >
                                {tag}
                              </Badge>
                            ))}
                          {community.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{community.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                      {!community.isJoined ? (
                        <Button
                          size="sm"
                          onClick={() => handleJoinCommunity(community.id)}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
                        >
                          <IconPlus className="h-4 w-4 mr-2" />
                          Participar
                        </Button>
                      ) : (
                        <Link
                          href={`/admin/dashboard/communities/${community.slug}`}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <IconMessage className="h-4 w-4 mr-2" />
                            Ver Discussões
                          </Button>
                        </Link>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {community.userRole === "OWNER" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleEditCommunity(community)}
                                className="cursor-pointer"
                              >
                                <IconEdit className="h-4 w-4 mr-2" />
                                Editar Comunidade
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteCommunity(community)}
                                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <IconTrash className="h-4 w-4 mr-2" />
                                Deletar Comunidade
                              </DropdownMenuItem>
                            </>
                          )}
                          {community.userRole === "MODERATOR" && (
                            <DropdownMenuItem
                              onClick={() => handleEditCommunity(community)}
                              className="cursor-pointer"
                            >
                              <IconEdit className="h-4 w-4 mr-2" />
                              Gerenciar Comunidade
                            </DropdownMenuItem>
                          )}
                          {!community.userRole ||
                          community.userRole === "MEMBER" ? (
                            <DropdownMenuItem
                              onClick={() => handleEditCommunity(community)}
                              className="cursor-pointer"
                            >
                              <IconEdit className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Todas as Comunidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsersGroup className="h-5 w-5" />
                Todas as Comunidades
              </CardTitle>
              <CardDescription>
                Explore e participe de comunidades por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 min-w-0">
                {filteredCommunities.length === 0 ? (
                  <div className="col-span-1 sm:col-span-2 text-center py-6 sm:py-8">
                    <div className="text-muted-foreground">
                      {searchTerm || activeFiltersCount > 0 ? (
                        <>
                          <p className="text-base sm:text-lg font-medium mb-2">
                            Nenhuma comunidade encontrada
                          </p>
                          <p className="text-sm mb-4">
                            Tente ajustar os filtros ou termos de busca
                          </p>
                          <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="w-full sm:w-auto"
                          >
                            Limpar filtros
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-base sm:text-lg font-medium mb-2">
                            Nenhuma comunidade disponível
                          </p>
                          <p className="text-sm mb-4">
                            Seja o primeiro a criar uma comunidade!
                          </p>
                          <Link
                            href="/admin/dashboard/communities/create"
                            className="w-full sm:w-auto block"
                          >
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
                              <IconPlus className="h-4 w-4 mr-2" />
                              Criar Comunidade
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredCommunities.map((community) => (
                    <div
                      key={community.id}
                      className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow bg-gradient-to-br from-gray-50 to-white dark:bg-card dark:border-border min-w-0"
                    >
                      <div className="flex flex-col gap-3 min-w-0">
                        {/* Header com Avatar e Informações */}
                        <div className="flex items-start gap-3 min-w-0">
                          {renderCommunityAvatar(community, "sm")}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-sm sm:text-base truncate">
                                {community.name}
                              </h4>
                              {community.isPrivate && (
                                <IconLock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                              {community.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <IconUsers className="h-3 w-3" />
                                {community.memberCount} membros
                              </span>
                              <span className="flex items-center gap-1">
                                <IconMessage className="h-3 w-3" />
                                {community.postCount} posts
                              </span>
                              <span className="flex items-center gap-1">
                                <IconActivity className="h-3 w-3" />
                                {community.level}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tags e Ações */}
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap gap-1">
                            {community.tags
                              .slice(0, 2)
                              .map((tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:bg-muted dark:text-foreground"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            {community.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{community.tags.length - 2}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch gap-2">
                            {!community.isJoined ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleJoinCommunity(community.id)
                                }
                                disabled={isLoading}
                                className="w-full sm:w-auto"
                              >
                                Participar
                              </Button>
                            ) : (
                              <Link
                                href={`/admin/dashboard/communities/${community.slug}`}
                                className="w-full sm:w-auto"
                              >
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-full sm:w-auto"
                                >
                                  Ver
                                </Button>
                              </Link>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full sm:w-auto"
                                >
                                  <IconDots className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {community.userRole === "OWNER" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEditCommunity(community)
                                      }
                                      className="cursor-pointer"
                                    >
                                      <IconEdit className="h-4 w-4 mr-2" />
                                      Editar Comunidade
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteCommunity(community)
                                      }
                                      className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <IconTrash className="h-4 w-4 mr-2" />
                                      Deletar Comunidade
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {community.userRole === "MODERATOR" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditCommunity(community)
                                    }
                                    className="cursor-pointer"
                                  >
                                    <IconEdit className="h-4 w-4 mr-2" />
                                    Gerenciar Comunidade
                                  </DropdownMenuItem>
                                )}
                                {!community.userRole ||
                                community.userRole === "MEMBER" ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditCommunity(community)
                                    }
                                    className="cursor-pointer"
                                  >
                                    <IconEdit className="h-4 w-4 mr-2" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Posts Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconMessage className="h-5 w-5" />
                Posts Recentes
              </CardTitle>
              <CardDescription>
                Discussões mais recentes das suas comunidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header com Avatar e Informações */}
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                        <AvatarFallback>
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="font-medium text-xs sm:text-sm">
                            {post.author.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            em
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {post.community.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-2 line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    {/* Tags e Estatísticas */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {post.metadata?.tags
                          ?.slice(0, 3)
                          .map((tag: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        {post.metadata?.tags &&
                          post.metadata.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.metadata.tags.length - 3}
                            </Badge>
                          )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconHeart className="h-3 w-3 sm:h-4 sm:w-4" />
                          {post.reactionCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconMessage className="h-3 w-3 sm:h-4 sm:w-4" />
                          {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Direita */}
        <div className="space-y-6 order-first xl:order-last min-w-0">
          {/* Categorias */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconTrendingUp className="h-5 w-5" />
                Categorias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-lg sm:text-xl flex-shrink-0">
                      {category.icon || "📁"}
                    </span>
                    <span className="font-medium text-sm sm:text-base truncate">
                      {category.name}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Eventos Próximos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Eventos Próximos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header com Título e Ícone */}
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-sm truncate">
                        {event.title}
                      </span>
                    </div>

                    {/* Informações do Evento */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString("pt-BR")}{" "}
                        •{" "}
                        {new Date(event.startDate).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • {event.location || "Online"}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                        <span>
                          {event.attendeeCount}/{event.maxAttendees || "∞"}{" "}
                          participantes
                        </span>
                        <Badge
                          variant={
                            event.type === "PRESENCIAL"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {event.type === "PRESENCIAL"
                            ? "Presencial"
                            : "Virtual"}
                        </Badge>
                      </div>
                    </div>

                    {/* Botão de Ação */}
                    <Button
                      size="sm"
                      className="w-full"
                      variant={event.isRegistered ? "outline" : "default"}
                    >
                      {event.isRegistered ? "Registrado" : "Participar"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Membros em Destaque */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconAward className="h-5 w-5" />
                Membros em Destaque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {topMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                    <AvatarFallback>
                      {member.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <span className="font-medium text-xs sm:text-sm truncate">
                        {member.user.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {member.level}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {member.role} • {member.community.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.postsCount} posts • {member.reputation} pontos
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
