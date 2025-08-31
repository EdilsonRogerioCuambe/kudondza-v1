"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteCommunity(communityId: string) {
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

    // Verificar se o usuário é o criador da comunidade
    if (community.creatorId !== session.user.id) {
      return { error: "Apenas o criador da comunidade pode excluí-la" };
    }

    // Verificar se há outros membros
    const memberCount = await prisma.communityMember.count({
      where: { communityId: community.id },
    });

    if (memberCount > 1) {
      return {
        error:
          "Não é possível excluir uma comunidade com outros membros. Transfira a propriedade primeiro.",
      };
    }

    // Excluir a comunidade (cascade irá excluir todos os dados relacionados)
    await prisma.community.delete({
      where: { id: community.id },
    });

    revalidatePath("/admin/dashboard/communities");
    redirect("/admin/dashboard/communities");
  } catch (error) {
    console.error("Erro ao excluir comunidade:", error);
    return { error: "Erro ao excluir comunidade" };
  }
}
