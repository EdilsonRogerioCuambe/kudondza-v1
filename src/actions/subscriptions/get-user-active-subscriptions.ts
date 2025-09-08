"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserActiveSubscriptions() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, data: [] };
    }

    // Buscar assinaturas ativas do usuário
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
      },
      select: {
        id: true,
        status: true,
        currentPeriodEnd: true,
        trialEnd: true,
        createdAt: true,
        metadata: true,
      },
    });

    return { success: true, data: subscriptions };
  } catch (error) {
    console.error("Error getting user active subscriptions:", error);
    return { success: false, data: [] };
  }
}
