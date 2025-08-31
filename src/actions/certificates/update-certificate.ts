"use server";

import prisma from "@/lib/prisma";
import { UpdateCertificateSchema } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

/**
 * Atualiza um certificado existente
 */
export async function updateCertificate(
  id: string,
  data: {
    title?: string;
    description?: string;
    templateData?: Record<string, unknown>;
    isValid?: boolean;
    validUntil?: Date;
    certificateUrl?: string;
  }
) {
  try {
    // Validar dados
    const validatedData = UpdateCertificateSchema.parse(data);

    // Verificar se o certificado existe
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existingCertificate) {
      throw new Error("Certificado não encontrado");
    }

    // Atualizar certificado
    const certificate = await prisma.certificate.update({
      where: { id },
      data: validatedData,
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

    // Revalidar páginas relacionadas
    revalidatePath("/admin/dashboard/certificates");
    revalidatePath(`/admin/dashboard/certificates/${id}`);

    return certificate;
  } catch (error) {
    console.error("Erro ao atualizar certificado:", error);
    throw new Error("Erro ao atualizar certificado");
  }
}

/**
 * Invalida um certificado
 */
export async function invalidateCertificate(id: string) {
  try {
    const certificate = await prisma.certificate.update({
      where: { id },
      data: { isValid: false },
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

    // Revalidar páginas relacionadas
    revalidatePath("/admin/dashboard/certificates");
    revalidatePath(`/admin/dashboard/certificates/${id}`);

    return certificate;
  } catch (error) {
    console.error("Erro ao invalidar certificado:", error);
    throw new Error("Erro ao invalidar certificado");
  }
}

/**
 * Revalida um certificado
 */
export async function revalidateCertificate(id: string) {
  try {
    const certificate = await prisma.certificate.update({
      where: { id },
      data: { isValid: true },
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

    // Revalidar páginas relacionadas
    revalidatePath("/admin/dashboard/certificates");
    revalidatePath(`/admin/dashboard/certificates/${id}`);

    return certificate;
  } catch (error) {
    console.error("Erro ao revalidar certificado:", error);
    throw new Error("Erro ao revalidar certificado");
  }
}
