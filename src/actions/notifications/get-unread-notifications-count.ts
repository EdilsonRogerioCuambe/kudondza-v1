"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const GetUnreadNotificationsCountSchema = z.object({
  userId: z.string().min(1).optional(),
});

export async function getUnreadNotificationsCount(
  data?: z.infer<typeof GetUnreadNotificationsCountSchema>
) {
  try {
    const validatedData = GetUnreadNotificationsCountSchema.parse(data || {});

    const where: any = {
      isRead: false,
    };

    if (validatedData.userId) {
      where.userId = validatedData.userId;
    }

    const count = await prisma.notification.count({ where });

    return { count };
  } catch (error) {
    console.error("Erro ao buscar contagem de notificações não lidas:", error);
    throw new Error("Falha ao buscar contagem de notificações não lidas");
  }
}
