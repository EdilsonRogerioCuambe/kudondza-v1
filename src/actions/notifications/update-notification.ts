"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateNotificationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
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
  data: z.record(z.string(), z.unknown()).optional(),
  actionUrl: z.string().url().optional(),
  expiresAt: z.date().optional(),
});

export async function updateNotification(
  data: z.infer<typeof UpdateNotificationSchema>
) {
  try {
    const validatedData = UpdateNotificationSchema.parse(data);

    // Verificar se a notificação existe
    const existingNotification = await prisma.notification.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingNotification) {
      throw new Error("Notificação não encontrada");
    }

    const notification = await prisma.notification.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        message: validatedData.message,
        type: validatedData.type,
        data: validatedData.data
          ? JSON.parse(JSON.stringify(validatedData.data))
          : undefined,
        actionUrl: validatedData.actionUrl,
        expiresAt: validatedData.expiresAt,
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
    console.error("Erro ao atualizar notificação:", error);
    throw new Error("Falha ao atualizar notificação");
  }
}
