/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";

interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Lista usuários com filtros e paginação
 */
export async function getUsers(filters: UserFilters = { page: 1, limit: 20 }) {
  try {
    const { search, role, isActive, page = 1, limit = 20 } = filters;

    // Construir where clause
    const where: {
      OR?: Array<{ [key: string]: any }>;
      role?: any;
      isActive?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) where.role = role;
    if (typeof isActive === "boolean") where.isActive = isActive;

    // Calcular offset
    const offset = (page - 1) * limit;

    // Buscar usuários
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          name: "asc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Calcular paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error("Erro ao buscar usuários");
  }
}
