"use client";

import { getCommunityPolls } from "@/actions/communities";
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
  IconChartBar,
  IconClock,
  IconPlus,
  IconSearch,
  IconStar,
  IconThumbUp,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommunityPoll {
  id: string;
  question: string;
  description: string | null;
  options: string[];
  allowMultipleVotes: boolean;
  isAnonymous: boolean;
  endDate: Date | null;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
}

export default function CommunityPollsPage() {
  const params = useParams();
  const router = useRouter();
  const [polls, setPolls] = useState<CommunityPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const pollsData = await getCommunityPolls(
          params.communitySlug as string
        );
        setPolls(pollsData);
      } catch (error) {
        console.error("Erro ao carregar enquetes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.communitySlug) {
      fetchPolls();
    }
  }, [params.communitySlug]);

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch =
      poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" &&
        (!poll.endDate || new Date(poll.endDate) > new Date())) ||
      (selectedStatus === "ended" &&
        poll.endDate &&
        new Date(poll.endDate) <= new Date());

    return matchesSearch && matchesStatus;
  });

  const sortedPolls = [...filteredPolls].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "mostVotes":
        return b.voteCount - a.voteCount;
      case "endingSoon":
        if (!a.endDate && !b.endDate) return 0;
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      default:
        return 0;
    }
  });

  const getPollStatus = (poll: CommunityPoll) => {
    if (!poll.endDate)
      return { label: "Sem prazo", color: "bg-stone-100 text-stone-800" };

    const now = new Date();
    const endDate = new Date(poll.endDate);

    if (endDate <= now) {
      return { label: "Encerrada", color: "bg-red-100 text-red-800" };
    }

    const diffInHours = Math.floor(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return {
        label: "Termina em breve",
        color: "bg-orange-100 text-orange-800",
      };
    }

    return { label: "Ativa", color: "bg-green-100 text-green-800" };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffInMs = end.getTime() - now.getTime();

    if (diffInMs <= 0) return "Encerrada";

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} dia${diffInDays > 1 ? "s" : ""} restante${
        diffInDays > 1 ? "s" : ""
      }`;
    }

    if (diffInHours > 0) {
      return `${diffInHours} hora${diffInHours > 1 ? "s" : ""} restante${
        diffInHours > 1 ? "s" : ""
      }`;
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""} restante${
      diffInMinutes > 1 ? "s" : ""
    }`;
  };

  const getVotePercentage = (totalVotes: number, optionVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((optionVotes / totalVotes) * 100);
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
            Enquetes da Comunidade
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Participe das votações e veja os resultados
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <IconThumbUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{polls.length}</p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Total de Enquetes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <IconChartBar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    polls.filter(
                      (p) => !p.endDate || new Date(p.endDate) > new Date()
                    ).length
                  }
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Enquetes Ativas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <IconUsers className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {polls
                    .reduce((sum, p) => sum + p.voteCount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Total de Votos
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
                  {polls.filter((p) => p.allowMultipleVotes).length}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Múltipla Escolha
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
              placeholder="Buscar enquetes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Enquetes</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="ended">Encerradas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="oldest">Mais Antigas</SelectItem>
              <SelectItem value="mostVotes">Mais Votadas</SelectItem>
              <SelectItem value="endingSoon">Terminando em Breve</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Nova Enquete */}
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Nova Enquete
          </Button>
        </div>
      </div>

      {/* Lista de Enquetes */}
      <div className="space-y-6">
        {sortedPolls.length === 0 ? (
          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
            <CardContent className="text-center py-12">
              <IconThumbUp className="h-16 w-16 mx-auto mb-4 text-stone-300" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                Nenhuma enquete encontrada
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                {searchTerm || selectedStatus !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Crie a primeira enquete para engajar a comunidade!"}
              </p>
              {!searchTerm && selectedStatus === "all" && (
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Criar Primeira Enquete
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          sortedPolls.map((poll) => {
            const status = getPollStatus(poll);
            const isActive =
              status.label === "Ativa" || status.label === "Termina em breve";

            return (
              <Card
                key={poll.id}
                className="overflow-hidden bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        {poll.creator.image ? (
                          <Image
                            src={poll.creator.image}
                            alt={poll.creator.name}
                            fill
                          />
                        ) : (
                          <AvatarFallback>
                            {poll.creator.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-stone-900 dark:text-white">
                            {poll.creator.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            Criador
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                          <span>Criada em {formatDate(poll.createdAt)}</span>
                          {poll.endDate && (
                            <span className="flex items-center gap-1">
                              <IconClock className="h-4 w-4" />
                              {formatTimeRemaining(poll.endDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={status.color}>{status.label}</Badge>
                      {poll.isAnonymous && (
                        <Badge variant="outline" className="text-xs">
                          Anônima
                        </Badge>
                      )}
                      {poll.allowMultipleVotes && (
                        <Badge variant="outline" className="text-xs">
                          Múltipla Escolha
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <h4 className="text-xl font-semibold text-stone-900 dark:text-white mb-3">
                    {poll.question}
                  </h4>

                  {poll.description && (
                    <div className="text-stone-700 dark:text-stone-300 mb-4">
                      <p>{poll.description}</p>
                    </div>
                  )}

                  {/* Opções da Enquete */}
                  <div className="space-y-3 mb-6">
                    {poll.options.map((option, index) => {
                      // Simular votos para demonstração (em produção viria do banco)
                      const optionVotes = Math.floor(
                        Math.random() * poll.voteCount
                      );
                      const percentage = getVotePercentage(
                        poll.voteCount,
                        optionVotes
                      );

                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{option}</span>
                            <span className="text-stone-600 dark:text-stone-400">
                              {optionVotes} votos ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <IconThumbUp className="h-4 w-4" />
                        {poll.voteCount.toLocaleString()} votos
                      </span>
                      <span className="flex items-center gap-1">
                        <IconUsers className="h-4 w-4" />
                        {poll.options.length} opções
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <Button>Votar</Button>
                      ) : (
                        <Button variant="outline" disabled>
                          Enquete Encerrada
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
