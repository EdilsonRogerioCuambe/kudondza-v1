"use server";

import prisma from "@/lib/prisma";

export type CommunityPollWithStats = {
  id: string;
  question: string;
  description: string | null;
  allowMultipleVotes: boolean;
  isAnonymous: boolean;
  endDate: Date | null;
  voteCount: number;
  optionCount: number;
  hasVoted: boolean;
  userVotes: number[];
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
  options: string[];
  createdAt: Date;
  updatedAt: Date;
};

export async function getCommunityPolls(
  communityId: string,
  options: {
    status?: "ACTIVE" | "ENDED";
    limit?: number;
    offset?: number;
    userId?: string;
  } = {}
): Promise<CommunityPollWithStats[]> {
  const { status, limit = 20, offset = 0, userId } = options;

  try {
    const where: {
      communityId: string;
      OR?: Array<{ endDate: null } | { endDate: { gt: Date } }>;
      endDate?: { lt: Date };
    } = {
      communityId,
    };

    if (status === "ACTIVE") {
      where.OR = [{ endDate: null }, { endDate: { gt: new Date() } }];
    } else if (status === "ENDED") {
      where.endDate = { lt: new Date() };
    }

    const polls = await prisma.communityPoll.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        votes: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                option: true,
              },
            }
          : false,
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: limit,
      skip: offset,
    });

    return polls.map((poll) => {
      const totalVotes = poll._count.votes;
      const userVotes = poll.votes.map((vote) => vote.option);
      const options = poll.options as string[];

      return {
        ...poll,
        voteCount: totalVotes,
        optionCount: options.length,
        hasVoted: userVotes.length > 0,
        userVotes,
        options,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar enquetes da comunidade:", error);
    throw new Error("Erro ao buscar enquetes da comunidade");
  }
}

export async function getActivePolls(
  communityId: string,
  limit = 5
): Promise<CommunityPollWithStats[]> {
  return getCommunityPolls(communityId, {
    status: "ACTIVE",
    limit,
  });
}

export async function getPollById(
  pollId: string,
  userId?: string
): Promise<CommunityPollWithStats | null> {
  try {
    const poll = await prisma.communityPoll.findUnique({
      where: { id: pollId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        votes: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                option: true,
              },
            }
          : false,
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!poll) {
      return null;
    }

    const totalVotes = poll._count.votes;
    const userVotes = poll.votes.map((vote) => vote.option);
    const options = poll.options as string[];

    return {
      ...poll,
      voteCount: totalVotes,
      optionCount: options.length,
      hasVoted: userVotes.length > 0,
      userVotes,
      options,
    };
  } catch (error) {
    console.error("Erro ao buscar enquete:", error);
    throw new Error("Erro ao buscar enquete");
  }
}
