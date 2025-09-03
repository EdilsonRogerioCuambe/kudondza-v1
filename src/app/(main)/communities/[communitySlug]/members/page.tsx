"use client";

import { getCommunityMembers } from "@/actions/communities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  IconCrown,
  IconSearch,
  IconShield,
  IconStar,
  IconUserCheck,
  IconUsers,
  IconUserX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommunityMember {
  id: string;
  role: string;
  status: string;
  joinedAt: Date;
  leftAt?: Date | null;
  notifications: boolean;
  isModerator: boolean;
  postsCount: number;
  eventsCount: number;
  reputation: number;
  user: {
    id: string;
    name: string;
    image: string | null;
    bio?: string | null;
    location?: string | null;
  };
}

export default function CommunityMembersPage() {
  const params = useParams();
  const router = useRouter();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("joined");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await getCommunityMembers(
          params.communitySlug as string
        );
        setMembers(membersData);
      } catch (error) {
        console.error("Erro ao carregar membros:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.communitySlug) {
      fetchMembers();
    }
  }, [params.communitySlug]);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "joined":
        return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      case "reputation":
        return b.reputation - a.reputation;
      case "posts":
        return b.postsCount - a.postsCount;
      case "events":
        return b.eventsCount - a.eventsCount;
      case "name":
        return a.user.name.localeCompare(b.user.name);
      default:
        return 0;
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <IconCrown className="h-4 w-4 text-yellow-600" />;
      case "ADMIN":
        return <IconShield className="h-4 w-4 text-red-600" />;
      case "MODERATOR":
        return <IconStar className="h-4 w-4 text-blue-600" />;
      case "MEMBER":
        return <IconUserCheck className="h-4 w-4 text-green-600" />;
      case "GUEST":
        return <IconUserX className="h-4 w-4 text-stone-600" />;
      default:
        return <IconUsers className="h-4 w-4 text-stone-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
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
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MEMBER":
        return "bg-green-100 text-green-800 border-green-200";
      case "GUEST":
        return "bg-stone-100 text-stone-800 border-stone-200";
      default:
        return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Ativo";
      case "INACTIVE":
        return "Inativo";
      case "SUSPENDED":
        return "Suspenso";
      case "BANNED":
        return "Banido";
      case "PENDING":
        return "Pendente";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-stone-100 text-stone-800";
      case "SUSPENDED":
        return "bg-yellow-100 text-yellow-800";
      case "BANNED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const memberDate = new Date(date);
    const diffInDays = Math.floor(
      (now.getTime() - memberDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Hoje";
    if (diffInDays === 1) return "Ontem";
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;

    return memberDate.toLocaleDateString("pt-BR");
  };

  const getReputationColor = (reputation: number) => {
    if (reputation >= 1000) return "text-purple-600";
    if (reputation >= 500) return "text-blue-600";
    if (reputation >= 100) return "text-green-600";
    if (reputation >= 50) return "text-yellow-600";
    return "text-stone-600";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-200 rounded"></div>
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
            Membros da Comunidade
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Conheça os membros e suas contribuições
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <IconUsers className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Total de Membros
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <IconStar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    members.filter(
                      (m) =>
                        m.role === "MODERATOR" ||
                        m.role === "ADMIN" ||
                        m.role === "OWNER"
                    ).length
                  }
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Moderadores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <IconUserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {members.filter((m) => m.status === "ACTIVE").length}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Membros Ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <IconStar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {members
                    .reduce((sum, m) => sum + m.reputation, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Reputação Total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barra de busca */}
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
            <Input
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Cargos</SelectItem>
              <SelectItem value="OWNER">Proprietário</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="MODERATOR">Moderador</SelectItem>
              <SelectItem value="MEMBER">Membro</SelectItem>
              <SelectItem value="GUEST">Convidado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="INACTIVE">Inativo</SelectItem>
              <SelectItem value="SUSPENDED">Suspenso</SelectItem>
              <SelectItem value="BANNED">Banido</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="joined">Mais Recentes</SelectItem>
              <SelectItem value="reputation">Maior Reputação</SelectItem>
              <SelectItem value="posts">Mais Posts</SelectItem>
              <SelectItem value="events">Mais Eventos</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Membros */}
      <div className="space-y-4">
        {sortedMembers.length === 0 ? (
          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
            <CardContent className="text-center py-12">
              <IconUsers className="h-16 w-16 mx-auto mb-4 text-stone-300" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                Nenhum membro encontrado
              </h3>
              <p className="text-stone-600 dark:text-stone-400">
                {searchTerm ||
                selectedRole !== "all" ||
                selectedStatus !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Esta comunidade ainda não tem membros."}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      {member.user.image ? (
                        <Image
                          src={member.user.image}
                          alt={member.user.name}
                          fill
                        />
                      ) : (
                        <AvatarFallback className="text-xl">
                          {member.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
                          {member.user.name}
                        </h3>
                        <Badge className={`${getRoleColor(member.role)}`}>
                          {getRoleIcon(member.role)}
                          <span className="ml-1">
                            {getRoleLabel(member.role)}
                          </span>
                        </Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {getStatusLabel(member.status)}
                        </Badge>
                      </div>

                      {member.user.bio && (
                        <p className="text-stone-600 dark:text-stone-400 mb-2 line-clamp-2">
                          {member.user.bio}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-sm text-stone-600 dark:text-stone-400">
                        {member.user.location && (
                          <span className="flex items-center gap-1">
                            <IconUsers className="h-4 w-4" />
                            {member.user.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <IconStar className="h-4 w-4" />
                          Membro desde {formatDate(member.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    {/* Estatísticas */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-stone-900 dark:text-white">
                        <span className={getReputationColor(member.reputation)}>
                          {member.reputation}
                        </span>
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Reputação
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                      <div className="text-center">
                        <div className="font-semibold">{member.postsCount}</div>
                        <div>Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">
                          {member.eventsCount}
                        </div>
                        <div>Eventos</div>
                      </div>
                    </div>
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
