"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getBadgesByCategory() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Buscar todas as badges disponíveis
    const allBadges = await prisma.badge.findMany({
      where: { isActive: true },
      orderBy: { rarity: "asc" },
    });

    // Buscar badges desbloqueadas pelo usuário
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
    });

    // Categorias de badges
    const categories = [
      {
        name: "Frontend",
        keywords: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
      },
      { name: "Backend", keywords: ["Node.js", "Database", "API", "Server"] },
      { name: "Design", keywords: ["UI", "UX", "Design", "Figma"] },
      { name: "DevOps", keywords: ["DevOps", "Docker", "AWS", "CI/CD"] },
      { name: "Mobile", keywords: ["Mobile", "React Native", "Flutter"] },
      { name: "AI", keywords: ["AI", "Machine Learning", "Data Science"] },
    ];

    // Mapear badges por categoria
    const badgesByCategory = categories.map((category) => {
      const categoryBadges = allBadges.filter((badge) =>
        category.keywords.some((keyword) =>
          badge.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      return {
        category: category.name,
        badges: categoryBadges.map((badge) => {
          const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
          return {
            name: badge.name,
            icon: getBadgeIcon(badge.name),
            earned: !!userBadge,
            category: category.name,
          };
        }),
      };
    });

    // Adicionar badges que não se encaixam em nenhuma categoria
    const categorizedBadgeIds = new Set(
      badgesByCategory.flatMap((cat) => cat.badges.map((b) => b.name))
    );

    const uncategorizedBadges = allBadges
      .filter((badge) => !categorizedBadgeIds.has(badge.name))
      .map((badge) => {
        const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
        return {
          name: badge.name,
          icon: getBadgeIcon(badge.name),
          earned: !!userBadge,
          category: "Geral",
        };
      });

    if (uncategorizedBadges.length > 0) {
      badgesByCategory.push({
        category: "Geral",
        badges: uncategorizedBadges,
      });
    }

    return badgesByCategory;
  } catch (error) {
    console.error("Erro ao buscar badges:", error);
    throw new Error("Falha ao carregar badges");
  }
}

function getBadgeIcon(badgeName: string): string {
  const iconMap: Record<string, string> = {
    React: "⚛️",
    TypeScript: "📘",
    JavaScript: "🟨",
    "Node.js": "🟢",
    Database: "🗄️",
    UI: "🎨",
    UX: "🎨",
    Design: "🎨",
    DevOps: "🐳",
    Mobile: "📱",
    AI: "🤖",
    "Machine Learning": "🧠",
    "Data Science": "📊",
    API: "🔌",
    Server: "🖥️",
    CSS: "🎨",
    HTML: "🌐",
    Docker: "🐳",
    AWS: "☁️",
    "CI/CD": "🔄",
    "React Native": "📱",
    Flutter: "🦋",
    Figma: "🎨",
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (badgeName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }

  return "🏆";
}
