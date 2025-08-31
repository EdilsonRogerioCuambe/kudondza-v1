"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export type UpcomingEventWithStats = {
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
  community: {
    id: string;
    name: string;
    slug: string;
    avatar: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
};

export async function getUpcomingEventsAll(
  limit = 10
): Promise<UpcomingEventWithStats[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  try {
    const events = await prisma.communityEvent.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
        status: "UPCOMING",
        community: {
          members: userId
            ? {
                some: {
                  userId: userId,
                },
              }
            : undefined,
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
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
      orderBy: [{ startDate: "asc" }],
      take: limit,
    });

    return events.map((event) => ({
      ...event,
      attendeeCount: event._count.attendees,
      isRegistered: event.attendees.length > 0,
      userStatus: event.attendees[0]?.status || null,
    }));
  } catch (error) {
    console.error("Erro ao buscar eventos próximos:", error);
    return [];
  }
}
