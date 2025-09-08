"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserCourseSubscriptions(courseIds: string[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, data: new Map() };
    }

    // Buscar assinaturas ativas do usuário para os cursos específicos
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
        OR: courseIds.map((courseId) => ({
          metadata: {
            path: ["courseId"],
            equals: courseId,
          },
        })),
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

    // Criar mapa de assinaturas por curso
    const subscriptionMap = new Map();

    subscriptions.forEach((subscription) => {
      if (
        subscription.metadata &&
        typeof subscription.metadata === "object" &&
        "courseId" in subscription.metadata
      ) {
        const courseId = subscription.metadata.courseId as string;
        subscriptionMap.set(courseId, {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          trialEnd: subscription.trialEnd,
          createdAt: subscription.createdAt,
        });
      }
    });

    return { success: true, data: subscriptionMap };
  } catch (error) {
    console.error("Error getting user course subscriptions:", error);
    return { success: false, data: new Map() };
  }
}
