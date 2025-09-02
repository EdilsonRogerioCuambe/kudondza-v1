"use client";

import {
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
} from "@/actions/notifications";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { NotificationForm } from "./_components/notification-form";
import { NotificationView } from "./_components/notification-view";
import { NotificationsHeader } from "./_components/notifications-header";
import { NotificationsList } from "./_components/notifications-list";
import { NotificationType } from "./_components/types";

export default function NotificationsPage() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);

  const loadUnreadCount = async () => {
    try {
      const result = await getUnreadNotificationsCount();
      setUnreadCount(result.count);
    } catch (error) {
      console.error("Erro ao carregar contagem de não lidas:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setUnreadCount(0);
      toast.success("Todas as notificações foram marcadas como lidas!");
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      toast.error("Erro ao marcar notificações como lidas");
    }
  };

  const handleEditNotification = (notification: NotificationType) => {
    setSelectedNotification(notification);
  };

  const handleViewNotification = (notification: NotificationType) => {
    setSelectedNotification(notification);
  };

  const handleFormSuccess = () => {
    setSelectedNotification(null);
    loadUnreadCount();
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <NotificationsHeader
        onOpenFilters={() => {}} // Será implementado quando integrarmos os filtros
        onOpenSearch={() => {}} // Será implementado quando integrarmos a busca
        onCreateNotification={() =>
          setSelectedNotification({} as NotificationType)
        }
        onMarkAllAsRead={handleMarkAllAsRead}
        unreadCount={unreadCount}
      />

      <Suspense fallback={<div>Carregando notificações...</div>}>
        <NotificationsList
          onEditNotification={handleEditNotification}
          onViewNotification={handleViewNotification}
        />
      </Suspense>

      {/* Formulário de criação/edição */}
      {selectedNotification && (
        <NotificationForm
          notification={
            selectedNotification.id ? selectedNotification : undefined
          }
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Visualização de notificação */}
      {selectedNotification && selectedNotification.id && (
        <NotificationView notification={selectedNotification} />
      )}
    </div>
  );
}
