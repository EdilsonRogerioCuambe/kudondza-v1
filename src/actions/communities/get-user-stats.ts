"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export type UserCommunityStats = {
  communitiesJoined: number;
  eventsAttended: number;
  postsCreated: number;
  reputation: number;
};

export async function getUserCommunityStats(): Promise<UserCommunityStats> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) {
    return {
      communitiesJoined: 0,
      eventsAttended: 0,
      postsCreated: 0,
      reputation: 0,
    };
  }

  try {
    const [communitiesCount, eventsCount, postsCount, totalReputation] =
      await Promise.all([
        prisma.communityMember.count({
          where: {
            userId: userId,
            status: "ACTIVE",
          },
        }),
        prisma.eventAttendee.count({
          where: {
            userId: userId,
            status: "REGISTERED",
            event: {
              startDate: {
                lte: new Date(),
              },
            },
          },
        }),
        prisma.communityPost.count({
          where: {
            authorId: userId,
          },
        }),
        prisma.communityMember.aggregate({
          where: {
            userId: userId,
            status: "ACTIVE",
          },
          _sum: {
            reputation: true,
          },
        }),
      ]);

    return {
      communitiesJoined: communitiesCount,
      eventsAttended: eventsCount,
      postsCreated: postsCount,
      reputation: totalReputation._sum.reputation || 0,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do usuário:", error);
    return {
      communitiesJoined: 0,
      eventsAttended: 0,
      postsCreated: 0,
      reputation: 0,
    };
  }
}
