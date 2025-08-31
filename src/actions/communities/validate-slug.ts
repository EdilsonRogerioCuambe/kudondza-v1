"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const validateSlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
});

export async function validateCommunitySlug(slug: string) {
  const validatedFields = validateSlugSchema.safeParse({ slug });

  if (!validatedFields.success) {
    return {
      available: false,
      error: "Slug deve conter apenas letras minúsculas, números e hífens",
    };
  }

  try {
    const existingCommunity = await prisma.community.findUnique({
      where: { slug },
      select: { id: true },
    });

    return {
      available: !existingCommunity,
      error: existingCommunity ? "Este slug já está em uso" : null,
    };
  } catch (error) {
    console.error("Erro ao validar slug:", error);
    return {
      available: false,
      error: "Erro ao validar slug",
    };
  }
}

export async function generateCommunitySlug(name: string) {
  try {
    // Converter nome para slug
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/-+/g, "-") // Remove hífens duplicados
      .trim();

    // Verificar se o slug já existe
    let finalSlug = slug;
    let counter = 1;

    while (true) {
      const exists = await prisma.community.findUnique({
        where: { slug: finalSlug },
        select: { id: true },
      });

      if (!exists) {
        break;
      }

      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    return { slug: finalSlug };
  } catch (error) {
    console.error("Erro ao gerar slug:", error);
    throw new Error("Erro ao gerar slug");
  }
}
