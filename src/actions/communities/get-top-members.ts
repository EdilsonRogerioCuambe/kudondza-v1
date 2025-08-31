"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export type TopMemberWithStats = {
  id: string;
  role: string;
  status: string;
  isModerator: boolean;
  notifications: boolean;
  postsCount: number;
  eventsCount: number;
  reputation: number;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
    email: string;
  };
  community: {
    id: string;
    name: string;
    slug: string;
    avatar: string | null;
  };
  level: string;
};

export async function getTopMembers(limit = 10): Promise<TopMemberWithStats[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  try {
    const members = await prisma.communityMember.findMany({
      where: {
        status: "ACTIVE",
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
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
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
      },
      orderBy: [
        { reputation: "desc" },
        { postsCount: "desc" },
        { eventsCount: "desc" },
      ],
      take: limit,
    });

    return members.map((member) => ({
      ...member,
      level: getMemberLevel(member.reputation),
    }));
  } catch (error) {
    console.error("Erro ao buscar membros em destaque:", error);
    return [];
  }
}

function getMemberLevel(reputation: number): string {
  if (reputation >= 5000) return "Lenda";
  if (reputation >= 2000) return "Mestre";
  if (reputation >= 1000) return "Expert";
  if (reputation >= 500) return "Avançado";
  if (reputation >= 100) return "Intermediário";
  return "Iniciante";
}
