"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export type CommunityDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  avatar: string | null;
  cover: string | null;
  banner: string | null;
  type: string;
  level: string;
  isPrivate: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  memberCount: number;
  postCount: number;
  eventCount: number;
  viewCount: number;
  tags: string[];
  maxMembers: number | null;
  allowInvites: boolean;
  requireApproval: boolean;
  allowPosts: boolean;
  allowEvents: boolean;
  allowPolls: boolean;
  autoModerate: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  } | null;
  subcategory: {
    id: string;
    name: string;
  } | null;
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  featuredAt: Date | null;
  isJoined: boolean;
  userRole: string | null;
  userStatus: string | null;
  isModerator: boolean;
  notifications: boolean;
  postsCount: number;
  eventsCount: number;
  reputation: number;
};

export async function getCommunity(slug: string) {
  try {
    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        category: true,
        subcategory: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
            events: true,
          },
        },
      },
    });

    if (!community) {
      return { success: false, error: "Comunidade não encontrada" };
    }

    return { success: true, community };
  } catch (error) {
    console.error("Erro ao buscar comunidade:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getCommunityForEdit(slug: string) {
  try {
    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        category: true,
        subcategory: true,
      },
    });

    if (!community) {
      return { success: false, error: "Comunidade não encontrada" };
    }

    return { success: true, community };
  } catch (error) {
    console.error("Erro ao buscar comunidade para edição:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

export async function getCommunityById(
  id: string
): Promise<CommunityDetail | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  try {
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        members: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                role: true,
                status: true,
                isModerator: true,
                notifications: true,
                postsCount: true,
                eventsCount: true,
                reputation: true,
              },
            }
          : false,
      },
    });

    if (!community) {
      return null;
    }

    const member = community.members[0];

    return {
      ...community,
      isJoined: member !== undefined,
      userRole: member?.role || null,
      userStatus: member?.status || null,
      isModerator: member?.isModerator || false,
      notifications: member?.notifications || false,
      postsCount: member?.postsCount || 0,
      eventsCount: member?.eventsCount || 0,
      reputation: member?.reputation || 0,
    };
  } catch (error) {
    console.error("Erro ao buscar comunidade:", error);
    throw new Error("Erro ao buscar comunidade");
  }
}
