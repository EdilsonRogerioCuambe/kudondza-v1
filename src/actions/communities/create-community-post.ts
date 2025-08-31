"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título muito longo"),
  content: z
    .string()
    .min(10, "Conteúdo deve ter pelo menos 10 caracteres")
    .max(10000, "Conteúdo muito longo"),
  type: z
    .enum([
      "TEXT",
      "ACHIEVEMENT",
      "COURSE_COMPLETION",
      "BADGE_EARNED",
      "PROJECT_SHARE",
      "QUESTION",
      "TIP",
    ])
    .default("TEXT"),
  media: z.array(z.string()).max(10, "Máximo de 10 mídias").default([]),
  tags: z.array(z.string()).max(10, "Máximo de 10 tags").default([]),
  isPinned: z.boolean().default(false),
  isAnnouncement: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  isPublished: z.boolean().default(true),
});

export async function createCommunityPost(
  communitySlug: string,
  formData: FormData
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Não autorizado" };
    }

    const validatedFields = createPostSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      type: formData.get("type") || "TEXT",
      media: formData.getAll("media"),
      tags: formData.getAll("tags"),
      isPinned: formData.get("isPinned") === "on",
      isAnnouncement: formData.get("isAnnouncement") === "on",
      allowComments: formData.get("allowComments") !== "off",
      isPublished: formData.get("isPublished") !== "off",
    });

    if (!validatedFields.success) {
      console.error("Erro de validação:", validatedFields.error);
      return { error: "Dados inválidos" };
    }

    const {
      title,
      content,
      type,
      media,
      tags,
      isPinned,
      isAnnouncement,
      allowComments,
      isPublished,
    } = validatedFields.data;

    // Verificar se a comunidade existe e se o usuário tem permissão
    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!community) {
      return { error: "Comunidade não encontrada" };
    }

    if (!community.allowPosts) {
      return { error: "Esta comunidade não permite criação de posts" };
    }

    const member = community.members[0];
    if (!member || member.status !== "ACTIVE") {
      return { error: "Você precisa ser um membro ativo para criar posts" };
    }

    // Verificar se precisa de moderação
    const needsModeration =
      community.autoModerate &&
      member.role !== "OWNER" &&
      member.role !== "ADMIN" &&
      !member.isModerator;

    // Preparar metadata com tags
    const metadata = {
      tags,
      isPublished,
      ...(media.length > 0 && { media }),
    };

    // Criar o post
    const post = await prisma.communityPost.create({
      data: {
        title,
        content,
        type,
        media,
        metadata,
        isPinned,
        isAnnouncement,
        allowComments,
        isModerated: needsModeration,
        communityId: community.id,
        authorId: session.user.id,
      },
    });

    // Atualizar contador de posts da comunidade
    await prisma.community.update({
      where: { id: community.id },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    // Atualizar contador de posts do membro
    await prisma.communityMember.update({
      where: {
        unique_community_member: {
          userId: session.user.id,
          communityId: community.id,
        },
      },
      data: {
        postsCount: {
          increment: 1,
        },
      },
    });

    revalidatePath(`/admin/dashboard/communities/${community.slug}`);
    revalidatePath("/admin/dashboard/communities");

    return {
      success: true,
      postId: post.id,
      message: "Post criado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return { error: "Erro interno do servidor" };
  }
}
