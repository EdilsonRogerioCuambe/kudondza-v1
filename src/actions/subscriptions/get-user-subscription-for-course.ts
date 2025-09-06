import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserSubscriptionForCourse(courseId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, data: null };
    }

    // Buscar assinatura ativa para o curso
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
        metadata: {
          path: ["courseId"],
          equals: courseId,
        },
      },
      select: {
        id: true,
        status: true,
        currentPeriodEnd: true,
        trialEnd: true,
        createdAt: true,
      },
    });

    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error getting user subscription for course:", error);
    return { success: false, data: null };
  }
}
