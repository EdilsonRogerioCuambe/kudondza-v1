"use client";

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
  IconCalendar,
  IconMessage,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";

interface CommunityMember {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  role: string;
  status: string;
  joinedAt: string;
  postsCount: number;
  eventsCount: number;
  reputation: number;
}

interface CommunityMembersProps {
  community: {
    _count: {
      members: number;
    };
    members: CommunityMember[];
  };
}

export function CommunityMembers({ community }: CommunityMembersProps) {
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      OWNER: "Proprietário",
      ADMIN: "Administrador",
      MODERATOR: "Moderador",
      MEMBER: "Membro",
    };
    return roles[role] || role;
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      ACTIVE: "Ativo",
      PENDING: "Pendente",
      SUSPENDED: "Suspenso",
    };
    return statuses[status] || status;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <IconUsers className="h-4 w-4 sm:h-5 sm:w-5" />
          Membros
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {community._count.members} membros na comunidade
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 sm:space-y-3">
          {community.members.slice(0, 10).map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:shadow-md transition-shadow min-w-0 bg-card"
            >
              {/* Header com Avatar e Nome */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                  <AvatarFallback className="text-xs sm:text-sm bg-muted text-muted-foreground">
                    {member.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium truncate text-sm sm:text-base">
                      {member.user.name}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="outline"
                        className="text-xs flex-shrink-0 bg-muted/50 text-muted-foreground border-border"
                      >
                        {getRoleLabel(member.role)}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0 bg-muted text-muted-foreground"
                      >
                        {getStatusLabel(member.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="text-xs text-muted-foreground">
                  Membro desde{" "}
                  {new Date(member.joinedAt).toLocaleDateString("pt-BR")}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconMessage className="h-3 w-3" />
                    {member.postsCount} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <IconCalendar className="h-3 w-3" />
                    {member.eventsCount} eventos
                  </span>
                  <span className="flex items-center gap-1">
                    <IconStar className="h-3 w-3" />
                    {member.reputation} pontos
                  </span>
                </div>
              </div>
            </div>
          ))}

          {community.members.length > 10 && (
            <div className="text-center py-2 sm:py-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-muted/50 hover:bg-muted border-border text-muted-foreground hover:text-foreground"
              >
                Ver todos os {community._count.members} membros
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
