"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const createPollSchema = z.object({
  question: z.string().min(3).max(500),
  description: z.string().max(1000).optional(),
  options: z.array(z.string()).min(2).max(10),
  allowMultipleVotes: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
  endDate: z.string().optional(),
});

export async function createCommunityPoll(
  communityId: string,
  formData: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const validatedFields = createPollSchema.safeParse({
    question: formData.get("question"),
    description: formData.get("description"),
    options: formData.getAll("options"),
    allowMultipleVotes: formData.get("allowMultipleVotes") === "true",
    isAnonymous: formData.get("isAnonymous") === "true",
    endDate: formData.get("endDate"),
  });

  if (!validatedFields.success) {
    return { error: "Dados inválidos" };
  }

  const {
    question,
    description,
    options,
    allowMultipleVotes,
    isAnonymous,
    endDate,
  } = validatedFields.data;

  try {
    // Verificar se a comunidade existe e se o usuário tem permissão
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

    if (!community.allowPolls) {
      return { error: "Esta comunidade não permite criação de enquetes" };
    }

    const member = community.members[0];
    if (
      !member ||
      (member.role !== "OWNER" &&
        member.role !== "ADMIN" &&
        !member.isModerator)
    ) {
      return {
        error: "Você não tem permissão para criar enquetes nesta comunidade",
      };
    }

    // Criar a enquete
    const poll = await prisma.communityPoll.create({
      data: {
        question,
        description,
        allowMultipleVotes,
        isAnonymous,
        endDate: endDate ? new Date(endDate) : null,
        communityId,
        creatorId: session.user.id,
        options: options, // Armazenar como JSON
      },
    });

    revalidatePath(`/admin/dashboard/communities/${community.slug}`);
    revalidatePath(`/admin/dashboard/communities/${community.slug}/polls`);

    return { success: true, pollId: poll.id };
  } catch (error) {
    console.error("Erro ao criar enquete:", error);
    return { error: "Erro ao criar enquete" };
  }
}
