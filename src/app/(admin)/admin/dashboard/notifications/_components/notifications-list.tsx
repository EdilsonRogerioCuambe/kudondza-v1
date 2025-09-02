"use client";

import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "@/actions/notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  IconBell,
  IconCheck,
  IconClock,
  IconEdit,
  IconEye,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { NotificationType } from "./types";

interface NotificationsListProps {
  onEditNotification: (notification: NotificationType) => void;
  onViewNotification: (notification: NotificationType) => void;
}

const getNotificationTypeColor = (type: NotificationType["type"]) => {
  switch (type) {
    case "SUCCESS":
      return "bg-green-100 text-green-800 border-green-200";
    case "WARNING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ERROR":
      return "bg-red-100 text-red-800 border-red-200";
    case "ACHIEVEMENT":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "SOCIAL":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "SYSTEM":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

const getNotificationTypeIcon = (type: NotificationType["type"]) => {
  switch (type) {
    case "SUCCESS":
      return "✓";
    case "WARNING":
      return "⚠";
    case "ERROR":
      return "✗";
    case "ACHIEVEMENT":
      return "🏆";
    case "SOCIAL":
      return "👥";
    case "SYSTEM":
      return "⚙";
    default:
      return "ℹ";
  }
};

export function NotificationsList({
  onEditNotification,
  onViewNotification,
}: NotificationsListProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const result = await getNotifications({
        page,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setNotifications(result.notifications as NotificationType[]);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead({ id });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        )
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification({ id });
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <IconBell className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma notificação encontrada
          </h3>
          <p className="text-gray-500 text-center">
            Não há notificações para exibir no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`transition-all duration-200 ${
            !notification.isRead
              ? "border-l-4 border-l-blue-500 bg-blue-50/50"
              : "hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={notification.user.image} />
                  <AvatarFallback>
                    {notification.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-sm font-medium">
                      {notification.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getNotificationTypeColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationTypeIcon(notification.type)}{" "}
                      {notification.type}
                    </Badge>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        Nova
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {notification.message}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewNotification(notification)}
                >
                  <IconEye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditNotification(notification)}
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(notification.id)}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <IconUser className="h-3 w-3" />
                  <span>{notification.user.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconClock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                {notification.isRead && notification.readAt && (
                  <div className="flex items-center gap-1">
                    <IconCheck className="h-3 w-3" />
                    <span>
                      Lida{" "}
                      {formatDistanceToNow(new Date(notification.readAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                )}
              </div>
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-xs"
                >
                  <IconCheck className="h-3 w-3 mr-1" />
                  Marcar como lida
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadNotifications(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadNotifications(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
