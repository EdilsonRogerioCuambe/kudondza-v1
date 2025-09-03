"use client";

import { getCommunityEvents } from "@/actions/communities";
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
  IconCalendar,
  IconClock,
  IconMapPin,
  IconPlus,
  IconSearch,
  IconUsers,
  IconVideo,
  IconWorld,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommunityEvent {
  id: string;
  title: string;
  description: string | null;
  type: string;
  location: string | null;
  meetingUrl?: string | null;
  maxAttendees: number | null;
  isFree: boolean;
  price: number | null;
  startDate: Date;
  endDate: Date;
  status: string;
  attendeeCount: number;
  viewCount: number;
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
}

export default function CommunityEventsPage() {
  const params = useParams();
  const router = useRouter();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getCommunityEvents(
          params.communitySlug as string
        );
        setEvents(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (eventsData as any[]).map((event) => ({
            ...event,
            price:
              typeof event.price === "number"
                ? event.price
                : event.price == null
                ? null
                : Number(event.price),
          })) as CommunityEvent[]
        );
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.communitySlug) {
      fetchEvents();
    }
  }, [params.communitySlug]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || event.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "ONLINE":
        return <IconVideo className="h-4 w-4" />;
      case "IN_PERSON":
        return <IconMapPin className="h-4 w-4" />;
      case "HYBRID":
        return <IconWorld className="h-4 w-4" />;
      case "WORKSHOP":
        return <IconCalendar className="h-4 w-4" />;
      case "MEETUP":
        return <IconUsers className="h-4 w-4" />;
      case "CONFERENCE":
        return <IconCalendar className="h-4 w-4" />;
      case "HACKATHON":
        return <IconCalendar className="h-4 w-4" />;
      default:
        return <IconCalendar className="h-4 w-4" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "ONLINE":
        return "Online";
      case "IN_PERSON":
        return "Presencial";
      case "HYBRID":
        return "Híbrido";
      case "WORKSHOP":
        return "Workshop";
      case "MEETUP":
        return "Meetup";
      case "CONFERENCE":
        return "Conferência";
      case "HACKATHON":
        return "Hackathon";
      default:
        return type;
    }
  };

  const getEventStatusLabel = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "Próximo";
      case "IN_PROGRESS":
        return "Em Andamento";
      case "COMPLETED":
        return "Concluído";
      case "CANCELLED":
        return "Cancelado";
      case "POSTPONED":
        return "Adiado";
      default:
        return status;
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-stone-100 text-stone-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "POSTPONED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
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

  const formatTimeRange = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startTime = start.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = end.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${startTime} - ${endTime}`;
  };

  const isEventUpcoming = (startDate: Date) => {
    return new Date(startDate) > new Date();
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
            Eventos da Comunidade
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Participe de workshops, meetups e conferências
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
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de Evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="IN_PERSON">Presencial</SelectItem>
              <SelectItem value="HYBRID">Híbrido</SelectItem>
              <SelectItem value="WORKSHOP">Workshop</SelectItem>
              <SelectItem value="MEETUP">Meetup</SelectItem>
              <SelectItem value="CONFERENCE">Conferência</SelectItem>
              <SelectItem value="HACKATHON">Hackathon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="UPCOMING">Próximos</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
              <SelectItem value="COMPLETED">Concluídos</SelectItem>
              <SelectItem value="CANCELLED">Cancelados</SelectItem>
              <SelectItem value="POSTPONED">Adiados</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Novo Evento */}
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-6">
        {sortedEvents.length === 0 ? (
          <Card className="bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border">
            <CardContent className="text-center py-12">
              <IconCalendar className="h-16 w-16 mx-auto mb-4 text-stone-300" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                {searchTerm ||
                selectedType !== "all" ||
                selectedStatus !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Organize o primeiro evento da comunidade!"}
              </p>
              {!searchTerm &&
                selectedType === "all" &&
                selectedStatus === "all" && (
                  <Button>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Criar Primeiro Evento
                  </Button>
                )}
            </CardContent>
          </Card>
        ) : (
          sortedEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden bg-background/60 dark:bg-background/30 backdrop-blur-sm border border-border"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      {event.creator.image ? (
                        <Image
                          src={event.creator.image}
                          alt={event.creator.name}
                          fill
                        />
                      ) : (
                        <AvatarFallback>
                          {event.creator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-stone-900 dark:text-white">
                          {event.creator.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          Organizador
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="h-4 w-4" />
                          {formatDate(event.startDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconClock className="h-4 w-4" />
                          {formatTimeRange(event.startDate, event.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getEventStatusColor(event.status)}>
                      {getEventStatusLabel(event.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <h4 className="text-xl font-semibold text-stone-900 dark:text-white mb-3">
                  {event.title}
                </h4>

                {event.description && (
                  <div className="text-stone-700 dark:text-stone-300 mb-4">
                    <p className="line-clamp-3">{event.description}</p>
                  </div>
                )}

                {/* Informações do Evento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                    {getEventTypeIcon(event.type)}
                    <span>{getEventTypeLabel(event.type)}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <IconMapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.meetingUrl && (
                    <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <IconVideo className="h-4 w-4" />
                      <span>Link da reunião disponível</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <IconUsers className="h-4 w-4" />
                    <span>
                      {event.attendeeCount.toLocaleString()}
                      {event.maxAttendees &&
                        ` / ${event.maxAttendees.toLocaleString()}`}{" "}
                      participantes
                    </span>
                  </div>
                </div>

                {/* Preço */}
                {!event.isFree && event.price && (
                  <div className="mb-4">
                    <Badge variant="outline" className="text-sm">
                      Preço: R$ {event.price.toFixed(2)}
                    </Badge>
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <IconUsers className="h-4 w-4" />
                      {event.attendeeCount.toLocaleString()} participantes
                    </span>
                    <span className="flex items-center gap-1">
                      <IconCalendar className="h-4 w-4" />
                      {event.viewCount.toLocaleString()} visualizações
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEventUpcoming(event.startDate) &&
                    event.status === "UPCOMING" ? (
                      <Button>Participar</Button>
                    ) : (
                      <Button variant="outline" disabled>
                        {event.status === "COMPLETED"
                          ? "Concluído"
                          : event.status === "CANCELLED"
                          ? "Cancelado"
                          : event.status === "POSTPONED"
                          ? "Adiado"
                          : "Em Andamento"}
                      </Button>
                    )}
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
