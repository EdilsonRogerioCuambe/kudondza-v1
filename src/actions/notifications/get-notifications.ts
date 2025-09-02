/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { NotificationFiltersSchema } from "./schemas";

export async function getNotifications(
  filters?: z.infer<typeof NotificationFiltersSchema>
) {
  try {
    const validatedFilters = NotificationFiltersSchema.parse(filters || {});

    const { search, type, isRead, userId, sortBy, sortOrder, page, limit } =
      validatedFilters;

    // Construir where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    if (userId) {
      where.userId = userId;
    }

    // Construir orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Calcular offset
    const offset = (page - 1) * limit;

    // Buscar notificações
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
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
      }),
      prisma.notification.count({ where }),
    ]);

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      notifications,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    throw new Error("Falha ao buscar notificações");
  }
}
