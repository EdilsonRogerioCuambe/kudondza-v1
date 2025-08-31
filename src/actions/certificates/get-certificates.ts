"use server";

import prisma from "@/lib/prisma";
import { CertificateFilters, CertificateFiltersSchema } from "@/lib/zod-schema";

/**
 * Lista certificados com filtros e paginação
 */
export async function getCertificates(
  filters: CertificateFilters = {
    page: 1,
    limit: 20,
    sortBy: "issuedAt",
    sortOrder: "desc",
  }
) {
  try {
    // Validar filtros
    const validatedFilters = CertificateFiltersSchema.parse(filters);

    const {
      search,
      userId,
      courseId,
      isValid,
      sortBy = "issuedAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = validatedFilters;

    // Construir where clause
    const where: {
      OR?: Array<{ [key: string]: unknown }>;
      userId?: string;
      courseId?: string;
      isValid?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { certificateNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;
    if (typeof isValid === "boolean") where.isValid = isValid;

    // Calcular offset
    const offset = (page - 1) * limit;

    // Buscar certificados
    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.certificate.count({ where }),
    ]);

    // Calcular paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      certificates,
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
    console.error("Erro ao buscar certificados:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check if it's a Prisma connection error
    if (error && typeof error === "object" && "code" in error) {
      console.error("Prisma error code:", (error as { code: string }).code);
    }

    throw new Error(
      `Erro ao buscar certificados: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Busca um certificado específico por ID
 */
export async function getCertificate(id: string) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            description: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      throw new Error("Certificado não encontrado");
    }

    return certificate;
  } catch (error) {
    console.error("Erro ao buscar certificado:", error);
    throw new Error("Erro ao buscar certificado");
  }
}

/**
 * Verifica se um certificado é válido pelo código de verificação
 */
export async function verifyCertificate(verificationCode: string) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return { isValid: false, message: "Certificado não encontrado" };
    }

    if (!certificate.isValid) {
      return { isValid: false, message: "Certificado inválido" };
    }

    if (certificate.validUntil && certificate.validUntil < new Date()) {
      return { isValid: false, message: "Certificado expirado" };
    }

    return { isValid: true, certificate };
  } catch (error) {
    console.error("Erro ao verificar certificado:", error);
    throw new Error("Erro ao verificar certificado");
  }
}
