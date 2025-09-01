"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserSettings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        accounts: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Buscar sessões ativas
    const activeSessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    // Formatar dados para a interface
    const userSettings = {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        location: user.location,
        website: user.website,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        loginCount: user.loginCount,
        isOnline: user.isOnline,
      },
      preferences: user.preferences || {
        notifications: {
          email: {
            courseUpdates: true,
            newMessages: true,
            systemAlerts: false,
            marketing: false,
          },
          push: {
            courseUpdates: true,
            newMessages: true,
            systemAlerts: true,
            marketing: false,
          },
          sms: {
            courseUpdates: false,
            newMessages: false,
            systemAlerts: true,
            marketing: false,
          },
        },
        privacy: {
          profileVisibility: "public",
          showEmail: false,
          showPhone: false,
          allowMessages: true,
          showOnlineStatus: true,
          allowAnalytics: true,
        },
        appearance: {
          theme: "system",
          language: "pt-BR",
          fontSize: "medium",
          compactMode: false,
          showAnimations: true,
        },
        twoFactorEnabled: false,
      },
      security: {
        twoFactorEnabled:
          ((user.preferences as Record<string, unknown>)
            ?.twoFactorEnabled as boolean) || false,
        activeSessions: activeSessions.length,
        loginHistory: activeSessions.map((session) => ({
          id: session.id,
          date: session.createdAt,
          device: session.userAgent || "Dispositivo desconhecido",
          location: "Localização não disponível", // Implementar geolocalização se necessário
          ipAddress: session.ipAddress,
        })),
      },
      theme: user.theme,
      language: user.language,
      timezone: user.timezone,
    };

    return { success: true, settings: userSettings };
  } catch (error) {
    console.error("Erro ao buscar configurações do usuário:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
