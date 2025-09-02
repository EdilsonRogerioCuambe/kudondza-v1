// Schema para filtros de notificações
import { z } from "zod";

export const NotificationFiltersSchema = z.object({
  search: z.string().optional(),
  type: z
    .enum([
      "INFO",
      "SUCCESS",
      "WARNING",
      "ERROR",
      "ACHIEVEMENT",
      "SOCIAL",
      "SYSTEM",
    ])
    .optional(),
  isRead: z.boolean().optional(),
  userId: z.string().optional(),
  sortBy: z.enum(["createdAt", "title", "type", "isRead"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});
