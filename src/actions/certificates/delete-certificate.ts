"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Deleta um certificado
 */
export async function deleteCertificate(id: string) {
  try {
    // Verificar se o certificado existe
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingCertificate) {
      throw new Error("Certificado não encontrado");
    }

    // Deletar certificado
    await prisma.certificate.delete({
      where: { id },
    });

    // Atualizar contador de certificados do usuário
    await prisma.gamification.update({
      where: { userId: existingCertificate.user.id },
      data: {
        certificatesEarned: {
          decrement: 1,
        },
      },
    });

    // Revalidar páginas relacionadas
    revalidatePath("/admin/dashboard/certificates");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar certificado:", error);
    throw new Error("Erro ao deletar certificado");
  }
}

/**
 * Deleta múltiplos certificados
 */
export async function deleteMultipleCertificates(ids: string[]) {
  try {
    // Verificar se os certificados existem
    const existingCertificates = await prisma.certificate.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (existingCertificates.length !== ids.length) {
      throw new Error("Alguns certificados não foram encontrados");
    }

    // Contar certificados por usuário para atualizar contadores
    const userCertificateCounts = existingCertificates.reduce((acc, cert) => {
      acc[cert.user.id] = (acc[cert.user.id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Deletar certificados
    await prisma.certificate.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    // Atualizar contadores de certificados dos usuários
    for (const [userId, count] of Object.entries(userCertificateCounts)) {
      await prisma.gamification.update({
        where: { userId },
        data: {
          certificatesEarned: {
            decrement: count,
          },
        },
      });
    }

    // Revalidar páginas relacionadas
    revalidatePath("/admin/dashboard/certificates");

    return { success: true, deletedCount: ids.length };
  } catch (error) {
    console.error("Erro ao deletar certificados:", error);
    throw new Error("Erro ao deletar certificados");
  }
}
