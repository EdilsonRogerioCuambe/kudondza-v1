"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconClock,
  IconExternalLink,
  IconEye,
  IconUser,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { NotificationType } from "./types";

interface NotificationViewProps {
  notification: NotificationType;
  trigger?: React.ReactNode;
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

export function NotificationView({
  notification,
  trigger,
}: NotificationViewProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <IconEye className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detalhes da Notificação</span>
            <Badge
              variant="outline"
              className={getNotificationTypeColor(notification.type)}
            >
              {getNotificationTypeIcon(notification.type)} {notification.type}
            </Badge>
            {!notification.isRead && <Badge variant="secondary">Nova</Badge>}
          </DialogTitle>
          <DialogDescription>
            Visualize os detalhes completos desta notificação.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Título</h3>
              <p className="text-gray-700">{notification.title}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Mensagem</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {notification.message}
              </p>
            </div>

            {notification.actionUrl && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">URL de Ação</h3>
                <div className="flex items-center gap-2">
                  <a
                    href={notification.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {notification.actionUrl}
                  </a>
                  <IconExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Informações do usuário */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Usuário Destinatário
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.user.image} />
                <AvatarFallback>
                  {notification.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {notification.user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {notification.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Informações de tempo */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Informações de Tempo
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconClock className="h-4 w-4" />
                <span>
                  Criada{" "}
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
              {notification.isRead && notification.readAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <IconUser className="h-4 w-4" />
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
          </div>

          {/* Dados adicionais */}
          {notification.data && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Dados Adicionais
              </h3>
              <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-auto">
                {JSON.stringify(notification.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
