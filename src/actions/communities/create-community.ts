"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const createCommunitySchema = z.object({
  name: z.string().min(3).max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(1000).optional(),
  shortDescription: z.string().min(10).max(200).optional(),
  avatar: z.string().optional(),
  cover: z.string().optional(),
  banner: z.string().optional(),
  type: z.enum([
    "PUBLIC",
    "PRIVATE",
    "COURSE_BASED",
    "PROFESSIONAL",
    "HOBBY",
    "ACADEMIC",
  ]),
  level: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
    "ALL_LEVELS",
    "EXPERT",
  ]),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  tags: z.array(z.string()).max(10),
  maxMembers: z.number().min(1).max(10000).optional(),
  allowInvites: z.boolean().default(true),
  requireApproval: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  allowPosts: z.boolean().default(true),
  allowEvents: z.boolean().default(true),
  allowPolls: z.boolean().default(true),
  autoModerate: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
});

export async function createCommunity(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const validatedFields = createCommunitySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription"),
    avatar: formData.get("avatar"),
    cover: formData.get("cover"),
    banner: formData.get("banner"),
    type: formData.get("type"),
    level: formData.get("level"),
    categoryId: formData.get("categoryId"),
    subcategoryId: formData.get("subcategoryId"),
    tags: formData.getAll("tags"),
    maxMembers: formData.get("maxMembers")
      ? Number(formData.get("maxMembers"))
      : undefined,
    allowInvites: formData.get("allowInvites") === "true",
    requireApproval: formData.get("requireApproval") === "true",
    isPrivate: formData.get("isPrivate") === "true",
    allowPosts: formData.get("allowPosts") === "true",
    allowEvents: formData.get("allowEvents") === "true",
    allowPolls: formData.get("allowPolls") === "true",
    autoModerate: formData.get("autoModerate") === "true",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    seoKeywords: formData.getAll("seoKeywords"),
  });

  if (!validatedFields.success) {
    return { error: "Dados inválidos" };
  }

  const {
    name,
    slug,
    description,
    shortDescription,
    avatar,
    cover,
    banner,
    type,
    level,
    categoryId,
    subcategoryId,
    tags,
    maxMembers,
    allowInvites,
    requireApproval,
    isPrivate,
    allowPosts,
    allowEvents,
    allowPolls,
    autoModerate,
    seoTitle,
    seoDescription,
    seoKeywords,
  } = validatedFields.data;

  try {
    // Verificar se o slug já existe
    const existingCommunity = await prisma.community.findUnique({
      where: { slug },
    });

    if (existingCommunity) {
      return { error: "Este slug já está em uso" };
    }

    // Criar a comunidade
    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        avatar,
        cover,
        banner,
        type,
        level,
        categoryId,
        subcategoryId,
        tags,
        maxMembers,
        allowInvites,
        requireApproval,
        isPrivate,
        allowPosts,
        allowEvents,
        allowPolls,
        autoModerate,
        seoTitle,
        seoDescription,
        seoKeywords,
        creatorId: session.user.id,
      },
    });

    // Adicionar o criador como membro com role OWNER
    await prisma.communityMember.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
        role: "OWNER",
        status: "ACTIVE",
        isModerator: true,
      },
    });

    revalidatePath("/admin/dashboard/communities");

    return {
      success: true,
      community: {
        id: community.id,
        slug: community.slug,
      },
    };
  } catch (error) {
    console.error("Erro ao criar comunidade:", error);
    return { error: "Erro ao criar comunidade" };
  }
}
