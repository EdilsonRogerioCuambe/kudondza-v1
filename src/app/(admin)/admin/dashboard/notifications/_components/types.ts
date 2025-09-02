// Tipos compartilhados para notificações
export type NotificationType = {
  id: string;
  title: string;
  message: string;
  type:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR"
    | "ACHIEVEMENT"
    | "SOCIAL"
    | "SYSTEM";
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  data?: Record<string, unknown>;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

export interface NotificationFilters {
  search?: string;
  type?:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR"
    | "ACHIEVEMENT"
    | "SOCIAL"
    | "SYSTEM";
  isRead?: boolean;
  sortBy: "createdAt" | "title" | "type" | "isRead";
  sortOrder: "asc" | "desc";
}
