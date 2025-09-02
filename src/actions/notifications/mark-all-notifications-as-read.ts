/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const MarkAllNotificationsAsReadSchema = z.object({
  userId: z.string().min(1).optional(),
});

export async function markAllNotificationsAsRead(
  data?: z.infer<typeof MarkAllNotificationsAsReadSchema>
) {
  try {
    const validatedData = MarkAllNotificationsAsReadSchema.parse(data || {});

    const where: any = {
      isRead: false,
    };

    if (validatedData.userId) {
      where.userId = validatedData.userId;
    }

    const result = await prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true,
      updatedCount: result.count,
    };
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    throw new Error("Falha ao marcar todas as notificações como lidas");
  }
}
