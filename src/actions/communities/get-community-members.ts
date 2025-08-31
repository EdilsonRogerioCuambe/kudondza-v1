"use server";

import prisma from "@/lib/prisma";

export type CommunityMemberWithStats = {
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
};

export async function getCommunityMembers(
  communityId: string,
  options: {
    role?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<CommunityMemberWithStats[]> {
  const { role, status, search, limit = 50, offset = 0 } = options;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      communityId,
    };

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const members = await prisma.communityMember.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
      take: limit,
      skip: offset,
    });

    return members;
  } catch (error) {
    console.error("Erro ao buscar membros da comunidade:", error);
    throw new Error("Erro ao buscar membros da comunidade");
  }
}

export async function getCommunityModerators(
  communityId: string
): Promise<CommunityMemberWithStats[]> {
  return getCommunityMembers(communityId, {
    role: "MODERATOR",
    status: "ACTIVE",
  });
}

export async function getCommunityAdmins(
  communityId: string
): Promise<CommunityMemberWithStats[]> {
  return getCommunityMembers(communityId, {
    role: "ADMIN",
    status: "ACTIVE",
  });
}

export async function getPendingMembers(
  communityId: string
): Promise<CommunityMemberWithStats[]> {
  return getCommunityMembers(communityId, {
    status: "PENDING",
  });
}
