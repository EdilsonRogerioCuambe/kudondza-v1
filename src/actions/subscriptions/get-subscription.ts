"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";

const getSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, "ID da assinatura é obrigatório"),
});

export async function getSubscription(
  data?: z.infer<typeof getSubscriptionSchema>
) {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Se não há dados, buscar a assinatura ativa do usuário
    if (!data) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: session.user.id,
          status: {
            in: ["ACTIVE", "TRIALING"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        data: subscription,
      };
    }

    // Validar dados
    const validatedData = getSubscriptionSchema.parse(data);

    // Buscar assinatura específica
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: validatedData.subscriptionId,
        userId: session.user.id,
      },
      include: {
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!subscription) {
      return {
        success: false,
        error: "Assinatura não encontrada",
      };
    }

    // Buscar curso relacionado se courseId estiver no metadata
    let course = null;
    if (
      subscription.metadata &&
      typeof subscription.metadata === "object" &&
      "courseId" in subscription.metadata
    ) {
      course = await prisma.course.findUnique({
        where: { id: subscription.metadata.courseId as string },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          description: true,
          instructor: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }

    return {
      success: true,
      data: {
        ...subscription,
        course,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
