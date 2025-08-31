import { getCommunity } from "@/actions/communities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  IconCalendar,
  IconClock,
  IconLock,
  IconMessage,
  IconPlus,
  IconShare,
  IconStar,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CommunityActions } from "./community-actions";
import { CommunityMembers } from "./community-members";

export default async function CommunityDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Fetch data server-side
  const result = await getCommunity(slug);

  if (!result.success || !result.community) {
    notFound();
  }

  const community = {
    ...result.community,
    createdAt: result.community.createdAt.toString(),
    updatedAt: result.community.updatedAt.toString(),
    members: result.community.members.map((member) => ({
      ...member,
      joinedAt: member.joinedAt.toString(),
    })),
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      PUBLIC: "Pública",
      PRIVATE: "Privada",
      PROFESSIONAL: "Profissional",
      HOBBY: "Hobby",
      ACADEMIC: "Acadêmica",
    };
    return types[type] || type;
  };

  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      BEGINNER: "Iniciante",
      INTERMEDIATE: "Intermediário",
      ADVANCED: "Avançado",
      EXPERT: "Expert",
      ALL_LEVELS: "Todos os Níveis",
    };
    return levels[level] || level;
  };

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8 pt-4 sm:pt-6 max-w-full overflow-hidden">
      {/* Header com Banner */}
      <div className="relative max-w-full overflow-hidden">
        {/* Banner */}
        {community.banner && (
          <div className="h-32 sm:h-40 md:h-48 w-full rounded-lg overflow-hidden mb-4 sm:mb-6">
            <Image
              src={community.banner}
              alt={`Banner da comunidade ${community.name}`}
              className="w-full h-full object-cover"
              width={800}
              height={200}
              unoptimized
            />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 lg:gap-4 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {community.avatar ? (
                <Avatar className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                  <AvatarFallback className="text-lg sm:text-xl md:text-2xl font-bold">
                    {community.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                  <AvatarFallback className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {community.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              {community.isPrivate && (
                <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-1">
                  <IconLock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Informações Básicas */}
            <div className="space-y-2 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
                  {community.name}
                </h1>
                {community.isPrivate && (
                  <Badge
                    variant="secondary"
                    className="flex-shrink-0 bg-muted text-muted-foreground border-border"
                  >
                    <IconLock className="h-3 w-3 mr-1" />
                    Privada
                  </Badge>
                )}
              </div>

              {community.shortDescription && (
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl line-clamp-2">
                  {community.shortDescription}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <IconUsers className="h-3 w-3 sm:h-4 sm:w-4" />
                  {community._count.members.toLocaleString()} membros
                </span>
                <span className="flex items-center gap-1">
                  <IconMessage className="h-3 w-3 sm:h-4 sm:w-4" />
                  {community._count.posts} posts
                </span>
                <span className="flex items-center gap-1">
                  <IconCalendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {community._count.events} eventos
                </span>
                <span className="flex items-center gap-1">
                  <IconClock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Criada em{" "}
                  {new Date(community.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>

          {/* Ações - Client Component */}
          <CommunityActions community={community} />
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3 max-w-full overflow-hidden">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          {/* Descrição Completa */}
          {community.description && (
            <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 dark:bg-card dark:border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <IconUsersGroup className="h-4 w-4 sm:h-5 sm:w-5" />
                  Sobre a Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-l-muted-foreground prose-blockquote:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80">
                  <ReactMarkdown>{community.description}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {community.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <IconStar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
                  {community.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 dark:bg-muted dark:text-foreground text-xs sm:text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configurações */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <IconStar className="h-4 w-4 sm:h-5 sm:w-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 min-w-0">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo</Label>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 dark:bg-muted dark:text-foreground"
                  >
                    {getTypeLabel(community.type)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nível</Label>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 dark:bg-muted dark:text-foreground"
                  >
                    {getLevelLabel(community.level)}
                  </Badge>
                </div>
              </div>

              {community.category && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Categoria</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {community.category.icon || "📁"}
                    </span>
                    <span>{community.category.name}</span>
                  </div>
                </div>
              )}

              {community.subcategory && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subcategoria</Label>
                  <span>{community.subcategory.name}</span>
                </div>
              )}

              {community.maxMembers && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Limite de Membros
                  </Label>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        (community._count.members / community.maxMembers) * 100
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      {community._count.members}/{community.maxMembers}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Membros - Client Component */}
          <CommunityMembers community={community} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6 order-first xl:order-last min-w-0">
          {/* Estatísticas */}
          <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 dark:bg-card dark:border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <IconStar className="h-4 w-4 sm:h-5 sm:w-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Membros</span>
                <Badge variant="secondary">{community._count.members}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Posts</span>
                <Badge variant="secondary">{community._count.posts}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Eventos</span>
                <Badge variant="secondary">{community._count.events}</Badge>
              </div>
              {community.maxMembers && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Capacidade</span>
                  <Badge variant="secondary">
                    {Math.round(
                      (community._count.members / community.maxMembers) * 100
                    )}
                    %
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconLock className="h-5 w-5" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Comunidade Privada</span>
                <Badge variant={community.isPrivate ? "default" : "secondary"}>
                  {community.isPrivate ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Requer Aprovação</span>
                <Badge
                  variant={community.requireApproval ? "default" : "secondary"}
                >
                  {community.requireApproval ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Convites</span>
                <Badge
                  variant={community.allowInvites ? "default" : "secondary"}
                >
                  {community.allowInvites ? "Sim" : "Não"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconMessage className="h-5 w-5" />
                Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Posts</span>
                <Badge variant={community.allowPosts ? "default" : "secondary"}>
                  {community.allowPosts ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Eventos</span>
                <Badge
                  variant={community.allowEvents ? "default" : "secondary"}
                >
                  {community.allowEvents ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Enquetes</span>
                <Badge variant={community.allowPolls ? "default" : "secondary"}>
                  {community.allowPolls ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Moderação Automática</span>
                <Badge
                  variant={community.autoModerate ? "default" : "secondary"}
                >
                  {community.autoModerate ? "Sim" : "Não"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          {(community.seoTitle || community.seoDescription) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconShare className="h-5 w-5" />
                  SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {community.seoTitle && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Título SEO</Label>
                    <p className="text-sm text-muted-foreground">
                      {community.seoTitle}
                    </p>
                  </div>
                )}
                {community.seoDescription && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Descrição SEO</Label>
                    <p className="text-sm text-muted-foreground">
                      {community.seoDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPlus className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {community.allowPosts && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link
                    href={`/admin/dashboard/communities/${slug}/create-post`}
                  >
                    <IconMessage className="h-4 w-4 mr-2" />
                    Criar Post
                  </Link>
                </Button>
              )}
              {community.allowEvents && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link
                    href={`/admin/dashboard/communities/${slug}/create-event`}
                  >
                    <IconCalendar className="h-4 w-4 mr-2" />
                    Criar Evento
                  </Link>
                </Button>
              )}
              {community.allowPolls && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link
                    href={`/admin/dashboard/communities/${slug}/create-poll`}
                  >
                    <IconStar className="h-4 w-4 mr-2" />
                    Criar Enquete
                  </Link>
                </Button>
              )}
              {community.allowInvites && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href={`/admin/dashboard/communities/${slug}/invite`}>
                    <IconUsers className="h-4 w-4 mr-2" />
                    Convidar Membros
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6 order-first xl:order-last min-w-0">
          {/* Estatísticas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <IconStar className="h-4 w-4 sm:h-5 sm:w-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Membros</span>
                <Badge variant="secondary">{community._count.members}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Posts</span>
                <Badge variant="secondary">{community._count.posts}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Eventos</span>
                <Badge variant="secondary">{community._count.events}</Badge>
              </div>
              {community.maxMembers && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Capacidade</span>
                  <Badge variant="secondary">
                    {Math.round(
                      (community._count.members / community.maxMembers) * 100
                    )}
                    %
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconLock className="h-5 w-5" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Comunidade Privada</span>
                <Badge variant={community.isPrivate ? "default" : "secondary"}>
                  {community.isPrivate ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Requer Aprovação</span>
                <Badge
                  variant={community.requireApproval ? "default" : "secondary"}
                >
                  {community.requireApproval ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Convites</span>
                <Badge
                  variant={community.allowInvites ? "default" : "secondary"}
                >
                  {community.allowInvites ? "Sim" : "Não"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconMessage className="h-5 w-5" />
                Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Posts</span>
                <Badge variant={community.allowPosts ? "default" : "secondary"}>
                  {community.allowPosts ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Eventos</span>
                <Badge
                  variant={community.allowEvents ? "default" : "secondary"}
                >
                  {community.allowEvents ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir Enquetes</span>
                <Badge variant={community.allowPolls ? "default" : "secondary"}>
                  {community.allowPolls ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Moderação Automática</span>
                <Badge
                  variant={community.autoModerate ? "default" : "secondary"}
                >
                  {community.autoModerate ? "Sim" : "Não"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          {(community.seoTitle || community.seoDescription) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconShare className="h-5 w-5" />
                  SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {community.seoTitle && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Título SEO</Label>
                    <p className="text-sm text-muted-foreground">
                      {community.seoTitle}
                    </p>
                  </div>
                )}
                {community.seoDescription && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Descrição SEO</Label>
                    <p className="text-sm text-muted-foreground">
                      {community.seoDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPlus className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {community.allowPosts && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link
                    href={`/admin/dashboard/communities/${slug}/create-post`}
                  >
                    <IconMessage className="h-4 w-4 mr-2" />
                    Criar Post
                  </Link>
                </Button>
              )}
              {community.allowEvents && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link
                    href={`/admin/dashboard/communities/${slug}/create-event`}
                  >
                    <IconCalendar className="h-4 w-4 mr-2" />
                    Criar Evento
                  </Link>
                </Button>
              )}
              {community.allowPolls && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link
                    href={`/admin/dashboard/communities/${slug}/create-poll`}
                  >
                    <IconStar className="h-4 w-4 mr-2" />
                    Criar Enquete
                  </Link>
                </Button>
              )}
              {community.allowInvites && (
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href={`/admin/dashboard/communities/${slug}/invite`}>
                    <IconUsers className="h-4 w-4 mr-2" />
                    Convidar Membros
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
