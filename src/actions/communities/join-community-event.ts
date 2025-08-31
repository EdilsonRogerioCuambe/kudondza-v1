"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function joinCommunityEvent(eventId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Verificar se o evento existe
    const event = await prisma.communityEvent.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
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

    if (!event) {
      return { error: "Evento não encontrado" };
    }

    // Verificar se o usuário é membro da comunidade
    if (event.community.members.length === 0) {
      return {
        error:
          "Você precisa ser membro da comunidade para participar do evento",
      };
    }

    // Verificar se já está inscrito
    if (event.attendees.length > 0) {
      return { error: "Você já está inscrito neste evento" };
    }

    // Verificar se o evento está cheio
    if (event.maxAttendees) {
      const attendeeCount = await prisma.eventAttendee.count({
        where: { eventId: event.id },
      });

      if (attendeeCount >= event.maxAttendees) {
        return { error: "Este evento está cheio" };
      }
    }

    // Verificar se o evento já passou
    if (event.startDate < new Date()) {
      return { error: "Este evento já passou" };
    }

    // Verificar se o evento está ativo
    if (event.status !== "UPCOMING") {
      return { error: "Este evento não está disponível para inscrições" };
    }

    // Inscrever no evento
    await prisma.eventAttendee.create({
      data: {
        userId: session.user.id,
        eventId: event.id,
        status: "REGISTERED",
      },
    });

    revalidatePath(`/admin/dashboard/communities/${event.community.slug}`);
    revalidatePath(
      `/admin/dashboard/communities/${event.community.slug}/events`
    );

    return { success: true };
  } catch (error) {
    console.error("Erro ao participar do evento:", error);
    return { error: "Erro ao participar do evento" };
  }
}

export async function leaveCommunityEvent(eventId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Verificar se o evento existe
    const event = await prisma.communityEvent.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
          where: { userId: session.user.id },
        },
        community: true,
      },
    });

    if (!event) {
      return { error: "Evento não encontrado" };
    }

    // Verificar se está inscrito
    if (event.attendees.length === 0) {
      return { error: "Você não está inscrito neste evento" };
    }

    // Remover inscrição
    await prisma.eventAttendee.delete({
      where: {
        unique_event_attendee: {
          userId: session.user.id,
          eventId: event.id,
        },
      },
    });

    revalidatePath(`/admin/dashboard/communities/${event.community.slug}`);
    revalidatePath(
      `/admin/dashboard/communities/${event.community.slug}/events`
    );

    return { success: true };
  } catch (error) {
    console.error("Erro ao sair do evento:", error);
    return { error: "Erro ao sair do evento" };
  }
}
