"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function leaveCommunity(communityId: string) {
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

    // Verificar se é membro
    if (community.members.length === 0) {
      return { error: "Você não é membro desta comunidade" };
    }

    const member = community.members[0];

    // Verificar se é o criador da comunidade
    if (member.role === "OWNER") {
      return {
        error:
          "O criador da comunidade não pode sair. Transfira a propriedade primeiro.",
      };
    }

    // Remover membro
    await prisma.communityMember.delete({
      where: {
        unique_community_member: {
          userId: session.user.id,
          communityId: community.id,
        },
      },
    });

    // Atualizar contador de membros
    await prisma.community.update({
      where: { id: community.id },
      data: {
        memberCount: {
          decrement: 1,
        },
      },
    });

    revalidatePath(`/admin/dashboard/communities/${community.slug}`);
    revalidatePath("/admin/dashboard/communities");

    return { success: true };
  } catch (error) {
    console.error("Erro ao sair da comunidade:", error);
    return { error: "Erro ao sair da comunidade" };
  }
}

export async function removeMember(communityId: string, memberId: string) {
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

    // Verificar se o usuário atual tem permissão para remover membros
    const currentMember = community.members[0];
    if (
      !currentMember ||
      (currentMember.role !== "OWNER" &&
        currentMember.role !== "ADMIN" &&
        !currentMember.isModerator)
    ) {
      return { error: "Você não tem permissão para remover membros" };
    }

    // Verificar se o membro a ser removido existe
    const memberToRemove = await prisma.communityMember.findUnique({
      where: {
        unique_community_member: {
          userId: memberId,
          communityId: community.id,
        },
      },
    });

    if (!memberToRemove) {
      return { error: "Membro não encontrado" };
    }

    // Verificar se não está tentando remover o criador
    if (memberToRemove.role === "OWNER") {
      return { error: "Não é possível remover o criador da comunidade" };
    }

    // Verificar se não está tentando remover um admin/moderador sem ser owner
    if (
      currentMember.role !== "OWNER" &&
      (memberToRemove.role === "ADMIN" || memberToRemove.isModerator)
    ) {
      return {
        error: "Apenas o criador pode remover administradores e moderadores",
      };
    }

    // Remover membro
    await prisma.communityMember.delete({
      where: {
        unique_community_member: {
          userId: memberId,
          communityId: community.id,
        },
      },
    });

    // Atualizar contador de membros
    await prisma.community.update({
      where: { id: community.id },
      data: {
        memberCount: {
          decrement: 1,
        },
      },
    });

    revalidatePath(`/admin/dashboard/communities/${community.slug}`);
    revalidatePath("/admin/dashboard/communities");

    return { success: true };
  } catch (error) {
    console.error("Erro ao remover membro da comunidade:", error);
    return { error: "Erro ao remover membro da comunidade" };
  }
}
