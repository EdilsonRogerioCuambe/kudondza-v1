/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";

export type CommunityPostWithStats = {
  id: string;
  title: string;
  content: string;
  type: string;
  media: string[];
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
  hasReacted: boolean;
  userReaction: string | null;
};

export async function getCommunityPosts(
  communityId: string,
  options: {
    type?: string;
    pinned?: boolean;
    limit?: number;
    offset?: number;
    userId?: string;
  } = {}
): Promise<CommunityPostWithStats[]> {
  const { type, pinned, limit = 20, offset = 0, userId } = options;

  try {
    const where: any = {
      communityId,
    };

    if (type) {
      where.type = type;
    }

    if (pinned !== undefined) {
      where.isPinned = pinned;
    }

    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
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
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    });

    return posts.map((post) => ({
      ...post,
      reactionCount: post._count.reactions,
      commentCount: post._count.comments,
      hasReacted: post.reactions.length > 0,
      userReaction: post.reactions[0]?.type || null,
      reactions: undefined,
      _count: undefined,
    }));
  } catch (error) {
    console.error("Erro ao buscar posts da comunidade:", error);
    throw new Error("Erro ao buscar posts da comunidade");
  }
}

export async function getPinnedPosts(
  communityId: string
): Promise<CommunityPostWithStats[]> {
  return getCommunityPosts(communityId, {
    pinned: true,
    limit: 5,
  });
}

export async function getAnnouncements(
  communityId: string
): Promise<CommunityPostWithStats[]> {
  try {
    const posts = await prisma.communityPost.findMany({
      where: {
        communityId,
        isAnnouncement: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
    });

    return posts.map((post) => ({
      ...post,
      reactionCount: post._count.reactions,
      commentCount: post._count.comments,
      hasReacted: false,
      userReaction: null,
      _count: undefined,
    }));
  } catch (error) {
    console.error("Erro ao buscar anúncios da comunidade:", error);
    throw new Error("Erro ao buscar anúncios da comunidade");
  }
}

export async function getPostById(
  postId: string,
  userId?: string
): Promise<CommunityPostWithStats | null> {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
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
    });

    if (!post) {
      return null;
    }

    // Incrementar contador de visualizações
    await prisma.communityPost.update({
      where: { id: post.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return {
      ...post,
      reactionCount: post._count.reactions,
      commentCount: post._count.comments,
      hasReacted: post.reactions.length > 0,
      userReaction: post.reactions[0]?.type || null,
    };
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    throw new Error("Erro ao buscar post");
  }
}
