"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const DeleteNotificationSchema = z.object({
  id: z.string().min(1),
});

export async function deleteNotification(
  data: z.infer<typeof DeleteNotificationSchema>
) {
  try {
    const { id } = DeleteNotificationSchema.parse(data);

    // Verificar se a notificação existe
    const existingNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      throw new Error("Notificação não encontrada");
    }

    await prisma.notification.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    throw new Error("Falha ao deletar notificação");
  }
}
