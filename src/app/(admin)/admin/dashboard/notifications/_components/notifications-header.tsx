"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import {
  IconCheck,
  IconFilter,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";

interface NotificationsHeaderProps {
  onOpenFilters: () => void;
  onOpenSearch: () => void;
  onCreateNotification: () => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export function NotificationsHeader({
  onOpenFilters,
  onOpenSearch,
  onCreateNotification,
  onMarkAllAsRead,
  unreadCount,
}: NotificationsHeaderProps) {
  return (
    <PageHeader
      title="Notificações"
      description="Gerencie todas as notificações da plataforma"
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onOpenFilters}
          >
            <IconFilter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onOpenSearch}
          >
            <IconSearch className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={onMarkAllAsRead}
            >
              <IconCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={onCreateNotification}
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Nova Notificação
          </Button>
        </>
      }
    />
  );
}
