"use server";

import prisma from "@/lib/prisma";

export type CommunityEventWithStats = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
  location: string | null;
  maxAttendees: number | null;
  isFree: boolean;
  price: unknown;
  attendeeCount: number;
  viewCount: number;
  isRegistered: boolean;
  userStatus: string | null;
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
};

export async function getCommunityEvents(
  communityId: string,
  options: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
    userId?: string;
  } = {}
): Promise<CommunityEventWithStats[]> {
  const { status, type, limit = 20, offset = 0, userId } = options;

  try {
    const where: Record<string, unknown> = {
      communityId,
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const events = await prisma.communityEvent.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        attendees: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                status: true,
              },
            }
          : false,
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    });

    return events.map((event) => ({
      ...event,
      attendeeCount: event._count.attendees,
      isRegistered: event.attendees.length > 0,
      userStatus: event.attendees[0]?.status || null,
    }));
  } catch (error) {
    console.error("Erro ao buscar eventos da comunidade:", error);
    throw new Error("Erro ao buscar eventos da comunidade");
  }
}

export async function getUpcomingEvents(
  communityId: string,
  limit = 5
): Promise<CommunityEventWithStats[]> {
  return getCommunityEvents(communityId, {
    status: "PUBLISHED",
    limit,
  });
}

export async function getEventById(
  eventId: string,
  userId?: string
): Promise<CommunityEventWithStats | null> {
  try {
    const event = await prisma.communityEvent.findUnique({
      where: { id: eventId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        attendees: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                status: true,
              },
            }
          : false,
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    if (!event) {
      return null;
    }

    return {
      ...event,
      attendeeCount: event._count.attendees,
      isRegistered: event.attendees.length > 0,
      userStatus: event.attendees[0]?.status || null,
    };
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    throw new Error("Erro ao buscar evento");
  }
}
