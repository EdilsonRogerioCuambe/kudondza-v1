"use server";

import prisma from "@/lib/prisma";
import { CreateCertificateSchema } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";

/**
 * Cria um novo certificado
 */
export async function createCertificate(data: {
  userId: string;
  courseId: string;
  title: string;
  description?: string;
  templateData: Record<string, unknown>;
  validUntil?: Date;
}) {
  try {
    // Validar dados
    const validatedData = CreateCertificateSchema.parse(data);

    // Gerar número único do certificado
    const certificateNumber = await generateUniqueCertificateNumber();

    // Gerar código de verificação único
    const verificationCode = await generateUniqueVerificationCode();

    // Criar certificado
    const certificate = await prisma.certificate.create({
      data: {
        ...validatedData,
        certificateNumber,
        verificationCode,
        templateData: validatedData.templateData,
      },
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

    // Atualizar contador de certificados do usuário
    await prisma.gamification.upsert({
      where: { userId: validatedData.userId },
      update: {
        certificatesEarned: {
          increment: 1,
        },
      },
      create: {
        userId: validatedData.userId,
        certificatesEarned: 1,
      },
    });

    // Revalidar páginas relacionadas
    revalidatePath("/admin/dashboard/certificates");
    revalidatePath(`/admin/dashboard/certificates/${certificate.id}`);

    return certificate;
  } catch (error) {
    console.error("Erro ao criar certificado:", error);
    throw new Error("Erro ao criar certificado");
  }
}

/**
 * Gera um número único de certificado
 */
async function generateUniqueCertificateNumber(): Promise<string> {
  const prefix = "CERT";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  let certificateNumber = `${prefix}-${timestamp}-${random}`;

  // Verificar se já existe
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.certificate.findUnique({
      where: { certificateNumber },
    });

    if (!existing) {
      return certificateNumber;
    }

    // Gerar novo número se já existir
    const newRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
    certificateNumber = `${prefix}-${timestamp}-${newRandom}`;
    attempts++;
  }

  throw new Error("Não foi possível gerar um número único de certificado");
}

/**
 * Gera um código de verificação único
 */
async function generateUniqueVerificationCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let verificationCode = "";

  for (let i = 0; i < 8; i++) {
    verificationCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Verificar se já existe
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.certificate.findUnique({
      where: { verificationCode },
    });

    if (!existing) {
      return verificationCode;
    }

    // Gerar novo código se já existir
    verificationCode = "";
    for (let i = 0; i < 8; i++) {
      verificationCode += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }
    attempts++;
  }

  throw new Error("Não foi possível gerar um código de verificação único");
}
