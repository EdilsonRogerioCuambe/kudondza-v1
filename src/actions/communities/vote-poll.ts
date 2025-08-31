"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function votePoll(pollId: string, optionIndices: number[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Verificar se a enquete existe
    const poll = await prisma.communityPoll.findUnique({
      where: { id: pollId },
      include: {
        votes: {
          where: { userId: session.user.id },
        },
        community: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!poll) {
      return { error: "Enquete não encontrada" };
    }

    // Verificar se o usuário é membro da comunidade
    if (poll.community.members.length === 0) {
      return { error: "Você precisa ser membro da comunidade para votar" };
    }

    // Verificar se a enquete ainda está ativa
    if (poll.endDate && poll.endDate < new Date()) {
      return { error: "Esta enquete já encerrou" };
    }

    // Verificar se já votou
    if (poll.votes.length > 0) {
      return { error: "Você já votou nesta enquete" };
    }

    // Verificar se as opções são válidas
    const options = poll.options as string[];
    const validOptionIndices = Array.from(
      { length: options.length },
      (_, i) => i
    );
    const invalidOptions = optionIndices.filter(
      (index) => !validOptionIndices.includes(index)
    );
    if (invalidOptions.length > 0) {
      return { error: "Opções inválidas selecionadas" };
    }

    // Verificar limite de votos
    if (!poll.allowMultipleVotes && optionIndices.length > 1) {
      return { error: "Esta enquete não permite múltiplos votos" };
    }

    // Registrar os votos
    await prisma.pollVote.createMany({
      data: optionIndices.map((optionIndex) => ({
        userId: session.user.id,
        pollId: poll.id,
        option: optionIndex,
      })),
    });

    revalidatePath(`/admin/dashboard/communities/${poll.community.slug}`);
    revalidatePath(`/admin/dashboard/communities/${poll.community.slug}/polls`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao votar na enquete:", error);
    return { error: "Erro ao votar na enquete" };
  }
}

export async function removeVote(pollId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Verificar se a enquete existe
    const poll = await prisma.communityPoll.findUnique({
      where: { id: pollId },
      include: {
        community: true,
      },
    });

    if (!poll) {
      return { error: "Enquete não encontrada" };
    }

    // Remover todos os votos do usuário nesta enquete
    await prisma.pollVote.deleteMany({
      where: {
        userId: session.user.id,
        pollId: poll.id,
      },
    });

    revalidatePath(`/admin/dashboard/communities/${poll.community.slug}`);
    revalidatePath(`/admin/dashboard/communities/${poll.community.slug}/polls`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao remover voto:", error);
    return { error: "Erro ao remover voto" };
  }
}
