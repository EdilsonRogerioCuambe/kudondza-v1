"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateCommunitySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  shortDescription: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  tags: z.array(z.string()).max(10, "Máximo de 10 tags"),
  type: z.enum(["PUBLIC", "PRIVATE", "PROFESSIONAL", "HOBBY", "ACADEMIC"]),
  level: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
    "EXPERT",
    "ALL_LEVELS",
  ]),
  maxMembers: z
    .number()
    .min(1)
    .max(10000)
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  categoryId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "none" ? null : val)),
  subcategoryId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "none" ? null : val)),
  isPrivate: z.boolean(),
  requireApproval: z.boolean(),
  allowInvites: z.boolean(),
  allowPosts: z.boolean(),
  allowEvents: z.boolean(),
  allowPolls: z.boolean(),
  autoModerate: z.boolean(),
  seoTitle: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  seoDescription: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  avatar: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  cover: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  banner: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
});

export async function updateCommunity(slug: string, formData: FormData) {
  try {
    // Validar dados do formulário
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      shortDescription: (formData.get("shortDescription") as string) || null,
      description: (formData.get("description") as string) || null,
      tags: formData.getAll("tags") as string[],
      type: formData.get("type") as string,
      level: formData.get("level") as string,
      maxMembers: formData.get("maxMembers")
        ? parseInt(formData.get("maxMembers") as string)
        : null,
      categoryId: (formData.get("categoryId") as string) || null,
      subcategoryId: (formData.get("subcategoryId") as string) || null,
      isPrivate: formData.get("isPrivate") === "on",
      requireApproval: formData.get("requireApproval") === "on",
      allowInvites: formData.get("allowInvites") === "on",
      allowPosts: formData.get("allowPosts") === "on",
      allowEvents: formData.get("allowEvents") === "on",
      allowPolls: formData.get("allowPolls") === "on",
      autoModerate: formData.get("autoModerate") === "on",
      seoTitle: (formData.get("seoTitle") as string) || null,
      seoDescription: (formData.get("seoDescription") as string) || null,
      avatar: (formData.get("avatar") as string) || null,
      cover: (formData.get("cover") as string) || null,
      banner: (formData.get("banner") as string) || null,
    };

    const validatedData = updateCommunitySchema.parse(rawData);

    // Verificar se a comunidade existe
    const existingCommunity = await prisma.community.findUnique({
      where: { slug },
    });

    if (!existingCommunity) {
      return { success: false, error: "Comunidade não encontrada" };
    }

    // Verificar se o novo slug já existe (se for diferente do atual)
    if (validatedData.slug !== slug) {
      const slugExists = await prisma.community.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return { success: false, error: "Slug já está em uso" };
      }
    }

    // Preparar dados para atualização
    const updateData: {
      name: string;
      slug: string;
      shortDescription?: string | null;
      description?: string | null;
      tags: string[];
      type: "PUBLIC" | "PRIVATE" | "PROFESSIONAL" | "HOBBY" | "ACADEMIC";
      level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | "ALL_LEVELS";
      maxMembers?: number | null;
      isPrivate: boolean;
      requireApproval: boolean;
      allowInvites: boolean;
      allowPosts: boolean;
      allowEvents: boolean;
      allowPolls: boolean;
      autoModerate: boolean;
      seoTitle?: string | null;
      seoDescription?: string | null;
      avatar?: string | null;
      cover?: string | null;
      banner?: string | null;
      categoryId?: string | null;
      subcategoryId?: string | null;
    } = {
      name: validatedData.name,
      slug: validatedData.slug,
      shortDescription: validatedData.shortDescription,
      description: validatedData.description,
      tags: validatedData.tags,
      type: validatedData.type,
      level: validatedData.level,
      maxMembers: validatedData.maxMembers,
      isPrivate: validatedData.isPrivate,
      requireApproval: validatedData.requireApproval,
      allowInvites: validatedData.allowInvites,
      allowPosts: validatedData.allowPosts,
      allowEvents: validatedData.allowEvents,
      allowPolls: validatedData.allowPolls,
      autoModerate: validatedData.autoModerate,
      seoTitle: validatedData.seoTitle,
      seoDescription: validatedData.seoDescription,
      avatar: validatedData.avatar,
      cover: validatedData.cover,
      banner: validatedData.banner,
      categoryId: validatedData.categoryId,
      subcategoryId: validatedData.subcategoryId,
    };

    // Atualizar comunidade
    const updatedCommunity = await prisma.community.update({
      where: { slug },
      data: updateData,
    });

    // Revalidar páginas relacionadas
    revalidatePath(`/admin/dashboard/communities/${updatedCommunity.slug}`);
    revalidatePath(`/admin/dashboard/communities/${slug}`);
    revalidatePath("/admin/dashboard/communities");

    return {
      success: true,
      community: updatedCommunity,
      message: "Comunidade atualizada com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    console.error("Erro ao atualizar comunidade:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}
