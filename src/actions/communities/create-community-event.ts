"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  type: z.enum(["ONLINE", "IN_PERSON", "HYBRID"]),
  status: z
    .enum([
      "DRAFT",
      "UPCOMING",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "POSTPONED",
    ])
    .default("DRAFT"),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  maxAttendees: z.number().min(1).max(10000).optional(),
  meetingUrl: z.string().url().optional(),
});

export async function createCommunityEvent(
  communityId: string,
  formData: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const validatedFields = createEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    status: formData.get("status"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    maxAttendees: formData.get("maxAttendees")
      ? Number(formData.get("maxAttendees"))
      : undefined,
    meetingUrl: formData.get("meetingUrl"),
  });

  if (!validatedFields.success) {
    return { error: "Dados inválidos" };
  }

  const {
    title,
    description,
    type,
    status,
    startDate,
    endDate,
    location,
    maxAttendees,
    meetingUrl,
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

    if (!community.allowEvents) {
      return { error: "Esta comunidade não permite criação de eventos" };
    }

    const member = community.members[0];
    if (
      !member ||
      (member.role !== "OWNER" &&
        member.role !== "ADMIN" &&
        !member.isModerator)
    ) {
      return {
        error: "Você não tem permissão para criar eventos nesta comunidade",
      };
    }

    // Criar o evento
    const event = await prisma.communityEvent.create({
      data: {
        title,
        description,
        type,
        status,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        maxAttendees,
        meetingUrl,
        communityId,
        creatorId: session.user.id,
      },
    });

    revalidatePath(`/admin/dashboard/communities/${community.slug}`);
    revalidatePath(`/admin/dashboard/communities/${community.slug}/events`);

    return { success: true, eventId: event.id };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return { error: "Erro ao criar evento" };
  }
}
