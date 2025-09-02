"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateNotificationSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  message: z.string().min(1, "Mensagem é obrigatória"),
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
    .default("INFO"),
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  data: z.record(z.any()).optional(),
  actionUrl: z.string().url().optional(),
  expiresAt: z.date().optional(),
});

export async function createNotification(
  data: z.infer<typeof CreateNotificationSchema>
) {
  try {
    const validatedData = CreateNotificationSchema.parse(data);

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const notification = await prisma.notification.create({
      data: {
        title: validatedData.title,
        message: validatedData.message,
        type: validatedData.type,
        userId: validatedData.userId,
        data: validatedData.data,
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
    console.error("Erro ao criar notificação:", error);
    throw new Error("Falha ao criar notificação");
  }
}
