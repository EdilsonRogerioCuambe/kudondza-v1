"use server";

import prisma from "@/lib/prisma";

export type CommunityWithStats = {
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
  category: {
    id: string;
    name: string;
    icon: string | null;
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
};

export async function getCommunities({
  search,
  category,
  level,
  type,
  featured,
  limit = 20,
  offset = 0,
  userId,
}: {
  search?: string;
  category?: string;
  level?: string;
  type?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  userId?: string;
} = {}): Promise<CommunityWithStats[]> {
  try {
    console.log("🔍 Buscando comunidades com parâmetros:", {
      search,
      category,
      level,
      type,
      featured,
      limit,
      offset,
      userId,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (level) {
      where.level = level;
    }

    if (type) {
      where.type = type;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    console.log("🔍 Where clause:", JSON.stringify(where, null, 2));

    // Primeiro, vamos fazer uma consulta simples para ver se há comunidades
    const simpleCommunities = await prisma.community.findMany({
      take: 5,
    });
    console.log(
      "🔍 Consulta simples retornou:",
      simpleCommunities.length,
      "comunidades"
    );

    const communities = await prisma.community.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
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
        members: {
          where: {
            userId: userId || "none", // Se não houver userId, usar "none" para não retornar membros
          },
          select: {
            role: true,
          },
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { memberCount: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    console.log(`✅ Encontradas ${communities.length} comunidades`);

    return communities.map((community) => ({
      ...community,
      isJoined: community.members.length > 0,
      userRole: community.members[0]?.role || null,
      members: undefined, // Remover do resultado
    }));
  } catch (error) {
    console.error("❌ Erro ao buscar comunidades:", error);
    return [];
  }
}

export async function getFeaturedCommunities(
  limit = 6
): Promise<CommunityWithStats[]> {
  try {
    console.log("⭐ Buscando comunidades em destaque...");
    const result = await getCommunities({ featured: false, limit });
    console.log(`⭐ Encontradas ${result.length} comunidades em destaque`);
    return result;
  } catch (error) {
    console.error("❌ Erro ao buscar comunidades em destaque:", error);
    return [];
  }
}

export async function getCommunitiesByCategory(
  categoryId: string,
  limit = 10
): Promise<CommunityWithStats[]> {
  return getCommunities({ category: categoryId, limit });
}

export async function getCommunitiesByLevel(
  level: string,
  limit = 10
): Promise<CommunityWithStats[]> {
  return getCommunities({ level, limit });
}

export async function getCommunitiesByType(
  type: string,
  limit = 10
): Promise<CommunityWithStats[]> {
  return getCommunities({ type, limit });
}

// Função para debug - contar total de comunidades
export async function getCommunitiesCount(): Promise<number> {
  try {
    const count = await prisma.community.count();
    console.log(`🔢 Total de comunidades no banco: ${count}`);
    return count;
  } catch (error) {
    console.error("❌ Erro ao contar comunidades:", error);
    return 0;
  }
}
