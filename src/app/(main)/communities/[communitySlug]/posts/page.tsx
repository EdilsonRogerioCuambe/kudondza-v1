"use client";

import { getCommunityPosts } from "@/actions/communities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconArrowLeft,
  IconBell,
  IconBookmark,
  IconEye,
  IconFlag,
  IconHeart,
  IconMessage,
  IconMessageCircle,
  IconPin,
  IconPlus,
  IconSearch,
  IconShare,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: string;
  media: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  isPinned: boolean;
  isAnnouncement: boolean;
  allowComments: boolean;
  isModerated: boolean;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
  pinnedAt: Date | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

export default function CommunityPostsPage() {
  const params = useParams();
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getCommunityPosts(
          params.communitySlug as string
        );
        setPosts(postsData);
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.communitySlug) {
      fetchPosts();
    }
  }, [params.communitySlug]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || post.type === selectedType;

    return matchesSearch && matchesType;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "mostViewed":
        return b.viewCount - a.viewCount;
      case "mostReactions":
        return b.reactionCount - a.reactionCount;
      case "mostComments":
        return b.commentCount - a.commentCount;
      default:
        return 0;
    }
  });

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "TEXT":
        return "Texto";
      case "IMAGE":
        return "Imagem";
      case "VIDEO":
        return "Vídeo";
      case "LINK":
        return "Link";
      case "POLL":
        return "Enquete";
      default:
        return type;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return "Ontem";

    return postDate.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-stone-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
            Posts da Comunidade
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Compartilhe conhecimento e participe das discussões
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barra de busca */}
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de Post" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="TEXT">Texto</SelectItem>
              <SelectItem value="IMAGE">Imagem</SelectItem>
              <SelectItem value="VIDEO">Vídeo</SelectItem>
              <SelectItem value="LINK">Link</SelectItem>
              <SelectItem value="POLL">Enquete</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="oldest">Mais Antigos</SelectItem>
              <SelectItem value="mostViewed">Mais Vistos</SelectItem>
              <SelectItem value="mostReactions">Mais Reações</SelectItem>
              <SelectItem value="mostComments">Mais Comentários</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Novo Post */}
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="space-y-6">
        {sortedPosts.length === 0 ? (
          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
            <CardContent className="text-center py-12">
              <IconMessage className="h-16 w-16 mx-auto mb-4 text-stone-300" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                Nenhum post encontrado
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                {searchTerm || selectedType !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Seja o primeiro a compartilhar algo nesta comunidade!"}
              </p>
              {!searchTerm && selectedType === "all" && (
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Criar Primeiro Post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border"
            >
              {/* Header do Post */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      {post.author.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          fill
                        />
                      ) : (
                        <AvatarFallback>
                          {post.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-stone-900 dark:text-white">
                          {post.author.name}
                        </h3>
                        {post.isPinned && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            <IconPin className="h-3 w-3 mr-1" />
                            Fixado
                          </Badge>
                        )}
                        {post.isAnnouncement && (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800"
                          >
                            <IconBell className="h-3 w-3 mr-1" />
                            Anúncio
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                        <span>{formatDate(post.createdAt)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getPostTypeLabel(post.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <IconBookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <IconShare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <IconFlag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Conteúdo do Post */}
              <CardContent className="pt-0">
                <h4 className="text-lg font-semibold text-stone-900 dark:text-white mb-3">
                  {post.title}
                </h4>

                <div className="text-stone-700 dark:text-stone-300 mb-4">
                  <p className="line-clamp-3">{post.content}</p>
                </div>

                {/* Mídia */}
                {post.media && post.media.length > 0 && (
                  <div className="mb-4">
                    {post.type === "IMAGE" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {post.media.slice(0, 4).map((media, index) => (
                          <div
                            key={index}
                            className="relative aspect-video bg-stone-100 rounded overflow-hidden"
                          >
                            <Image
                              src={media}
                              alt={`Imagem ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {post.type === "VIDEO" && (
                      <div className="aspect-video bg-stone-100 rounded overflow-hidden">
                        <video
                          src={post.media[0]}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Estatísticas e Ações */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm text-stone-600 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <IconEye className="h-4 w-4" />
                      {post.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconHeart className="h-4 w-4" />
                      {post.reactionCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconMessageCircle className="h-4 w-4" />
                      {post.commentCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconShare className="h-4 w-4" />
                      {post.shareCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <IconHeart className="h-4 w-4 mr-2" />
                      Reagir
                    </Button>
                    <Button variant="ghost" size="sm">
                      <IconMessageCircle className="h-4 w-4 mr-2" />
                      Comentar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
