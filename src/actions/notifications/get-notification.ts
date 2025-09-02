"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const GetNotificationSchema = z.object({
  id: z.string().min(1),
});

export async function getNotification(
  data: z.infer<typeof GetNotificationSchema>
) {
  try {
    const { id } = GetNotificationSchema.parse(data);

    const notification = await prisma.notification.findUnique({
      where: { id },
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

    if (!notification) {
      throw new Error("Notificação não encontrada");
    }

    return notification;
  } catch (error) {
    console.error("Erro ao buscar notificação:", error);
    throw new Error("Falha ao buscar notificação");
  }
}
