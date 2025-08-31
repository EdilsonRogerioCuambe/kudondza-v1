"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export type RecentPostWithStats = {
  id: string;
  title: string;
  content: string;
  type: string;
  media: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  isPinned: boolean;
  isAnnouncement: boolean;
  allowComments: boolean;
  isModerated: boolean;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
  pinnedAt: Date | null;
  author: {
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
  hasReacted: boolean;
  userReaction: string | null;
};

export async function getRecentPosts(
  limit = 10
): Promise<RecentPostWithStats[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  try {
    const posts = await prisma.communityPost.findMany({
      where: {
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
        author: {
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
        reactions: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                type: true,
              },
            }
          : false,
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: limit,
    });

    return posts.map((post) => ({
      ...post,
      reactionCount: post._count.reactions,
      commentCount: post._count.comments,
      hasReacted: post.reactions.length > 0,
      userReaction: post.reactions[0]?.type || null,
    }));
  } catch (error) {
    console.error("Erro ao buscar posts recentes:", error);
    return [];
  }
}
