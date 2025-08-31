"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function joinCommunity(communityId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Verificar se a comunidade existe
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!community) {
      return { error: "Comunidade não encontrada" };
    }

    // Verificar se já é membro
    if (community.members.length > 0) {
      return { error: "Você já é membro desta comunidade" };
    }

    // Verificar se a comunidade está cheia
    if (community.maxMembers && community.memberCount >= community.maxMembers) {
      return { error: "Esta comunidade está cheia" };
    }

    // Verificar se a comunidade é privada e requer aprovação
    const requiresApproval = community.isPrivate || community.requireApproval;

    // Adicionar membro
    await prisma.communityMember.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
        role: "MEMBER",
        status: requiresApproval ? "PENDING" : "ACTIVE",
      },
    });

    // Atualizar contador de membros se não precisar de aprovação
    if (!requiresApproval) {
      await prisma.community.update({
        where: { id: community.id },
        data: {
          memberCount: {
            increment: 1,
          },
        },
      });
    }

    revalidatePath(`/admin/dashboard/communities/${community.slug}`);
    revalidatePath("/admin/dashboard/communities");

    return { success: true };
  } catch (error) {
    console.error("Erro ao participar da comunidade:", error);
    return { error: "Erro ao participar da comunidade" };
  }
}

export async function requestJoinCommunity(communityId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Verificar se a comunidade existe
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!community) {
      return { error: "Comunidade não encontrada" };
    }

    // Verificar se já é membro ou tem pedido pendente
    if (community.members.length > 0) {
      const member = community.members[0];
      if (member.status === "ACTIVE") {
        return { error: "Você já é membro desta comunidade" };
      }
      if (member.status === "PENDING") {
        return { error: "Você já tem um pedido pendente" };
      }
    }

    // Verificar se a comunidade está cheia
    if (community.maxMembers && community.memberCount >= community.maxMembers) {
      return { error: "Esta comunidade está cheia" };
    }

    // Criar ou atualizar pedido de participação
    await prisma.communityMember.upsert({
      where: {
        unique_community_member: {
          userId: session.user.id,
          communityId: community.id,
        },
      },
      update: {
        status: "PENDING",
      },
      create: {
        userId: session.user.id,
        communityId: community.id,
        role: "MEMBER",
        status: "PENDING",
      },
    });

    revalidatePath(`/admin/dashboard/communities/${community.slug}`);
    revalidatePath("/admin/dashboard/communities");

    return { success: true };
  } catch (error) {
    console.error("Erro ao solicitar participação na comunidade:", error);
    return { error: "Erro ao solicitar participação na comunidade" };
  }
}
