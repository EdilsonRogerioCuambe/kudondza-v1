"use client";

import {
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
} from "@/actions/communities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CommunityActionsProps {
  community: {
    id: string;
    name: string;
    slug: string;
    isPrivate: boolean;
    members: Array<{
      id: string;
      user: { id: string };
      role: string;
    }>;
  };
}

export function CommunityActions({ community }: CommunityActionsProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Mock user ID - in real app, get from auth context
  const currentUserId = "current-user-id";

  const currentMember = community.members.find(
    (member) => member.user.id === currentUserId
  );

  const isJoined = !!currentMember;
  const userRole = currentMember?.role || null;

  const handleEditCommunity = () => {
    router.push(`/admin/dashboard/communities/${community.slug}/edit`);
  };

  const handleDeleteCommunity = async () => {
    if (
      !confirm(
        `Tem certeza que deseja deletar a comunidade "${community.name}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    try {
      const result = await deleteCommunity(community.id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Comunidade deletada com sucesso!");
        router.push("/admin/dashboard/communities");
      }
    } catch (error) {
      console.error("Erro ao deletar comunidade:", error);
      toast.error("Erro ao deletar comunidade");
    }
  };

  const handleJoinCommunity = async () => {
    try {
      setIsJoining(true);
      const result = await joinCommunity(community.id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Você entrou na comunidade!");
        // Refresh the page to update the UI
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao entrar na comunidade:", error);
      toast.error("Erro ao entrar na comunidade");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      setIsLeaving(true);
      const result = await leaveCommunity(community.id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Você saiu da comunidade");
        // Refresh the page to update the UI
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao sair da comunidade:", error);
      toast.error("Erro ao sair da comunidade");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto min-w-0">
      {isJoined && (
        <Badge
          variant="default"
          className="bg-muted text-muted-foreground border-border"
        >
          <IconUsers className="h-3 w-3 mr-1" />
          Participando
        </Badge>
      )}

      {!isJoined ? (
        <Button
          onClick={handleJoinCommunity}
          disabled={isJoining}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
        >
          {isJoining ? (
            "Entrando..."
          ) : (
            <>
              <IconPlus className="h-4 w-4 mr-2" />
              Participar
            </>
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={handleLeaveCommunity}
          disabled={isLeaving}
          className="border-border text-muted-foreground hover:bg-muted hover:text-foreground w-full sm:w-auto"
        >
          {isLeaving ? "Saindo..." : "Sair da Comunidade"}
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto bg-muted/50 hover:bg-muted border-border"
          >
            <IconDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {userRole === "OWNER" && (
            <>
              <DropdownMenuItem
                onClick={handleEditCommunity}
                className="cursor-pointer"
              >
                <IconEdit className="h-4 w-4 mr-2" />
                Editar Comunidade
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteCommunity}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <IconTrash className="h-4 w-4 mr-2" />
                Deletar Comunidade
              </DropdownMenuItem>
            </>
          )}
          {userRole === "MODERATOR" && (
            <DropdownMenuItem
              onClick={handleEditCommunity}
              className="cursor-pointer"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Gerenciar Comunidade
            </DropdownMenuItem>
          )}
          {!userRole || userRole === "MEMBER" ? (
            <DropdownMenuItem
              onClick={handleEditCommunity}
              className="cursor-pointer"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Ver Detalhes
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
