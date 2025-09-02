"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const MarkNotificationAsReadSchema = z.object({
  id: z.string().min(1),
});

export async function markNotificationAsRead(
  data: z.infer<typeof MarkNotificationAsReadSchema>
) {
  try {
    const { id } = MarkNotificationAsReadSchema.parse(data);

    // Verificar se a notificação existe
    const existingNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      throw new Error("Notificação não encontrada");
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return notification;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw new Error("Falha ao marcar notificação como lida");
  }
}
