"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cancelStripeSubscription } from "@/lib/stripe-subscriptions";
import { headers } from "next/headers";
import { z } from "zod";

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, "ID da assinatura é obrigatório"),
});

export async function cancelSubscription(
  data: z.infer<typeof cancelSubscriptionSchema>
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

    // Validar dados
    const validatedData = cancelSubscriptionSchema.parse(data);

    // Buscar assinatura
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: validatedData.subscriptionId,
        userId: session.user.id,
      },
      select: {
        id: true,
        status: true,
        stripeSubscriptionId: true,
        endedAt: true,
      },
    });

    if (!subscription) {
      return {
        success: false,
        error: "Assinatura não encontrada",
      };
    }

    if (subscription.status === "CANCELED") {
      return {
        success: false,
        error: "Assinatura já foi cancelada",
      };
    }

    if (
      subscription.status === "INCOMPLETE" ||
      subscription.status === "INCOMPLETE_EXPIRED"
    ) {
      return {
        success: false,
        error: "Assinatura não está ativa",
      };
    }

    // Cancelar no Stripe
    if (subscription.stripeSubscriptionId) {
      await cancelStripeSubscription(subscription.stripeSubscriptionId);
    }

    // Atualizar no banco de dados
    const updatedSubscription = await prisma.subscription.update({
      where: { id: validatedData.subscriptionId },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
        canceledAt: updatedSubscription.canceledAt,
        endDate: subscription.endedAt,
      },
    };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);

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
