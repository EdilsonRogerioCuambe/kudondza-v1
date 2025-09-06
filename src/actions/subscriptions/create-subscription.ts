"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createStripeSubscription } from "@/lib/stripe-subscriptions";
import { headers } from "next/headers";
import { z } from "zod";

const createSubscriptionSchema = z.object({
  courseId: z.string().min(1, "ID do curso é obrigatório"),
  interval: z.enum(["monthly", "semesterly", "yearly"]),
});

export async function createSubscription(
  data: z.infer<typeof createSubscriptionSchema>
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
    const validatedData = createSubscriptionSchema.parse(data);

    // Verificar se o curso existe e tem preços configurados
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
      select: {
        id: true,
        title: true,
        price: true,
        stripePriceId: true,
      },
    });

    if (!course) {
      return {
        success: false,
        error: "Curso não encontrado",
      };
    }

    // Verificar se o preço do Stripe está configurado
    if (!course.stripePriceId) {
      return {
        success: false,
        error: "Preço do Stripe não configurado para este curso",
      };
    }

    // Verificar se o usuário já tem uma assinatura ativa para este curso
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        metadata: {
          path: ["courseId"],
          equals: validatedData.courseId,
        },
        status: {
          in: ["ACTIVE", "TRIALING", "PAST_DUE"],
        },
      },
    });

    if (existingSubscription) {
      return {
        success: false,
        error: "Você já possui uma assinatura ativa para este curso",
      };
    }

    // Criar assinatura no Stripe
    const { subscriptionId, clientSecret } = await createStripeSubscription({
      userId: session.user.id,
      courseId: validatedData.courseId,
      interval: validatedData.interval,
    });

    // Usar o preço do curso
    const price = Number(course.price);

    // Criar assinatura no banco de dados
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        status: "INCOMPLETE",
        stripeSubscriptionId: subscriptionId,
        metadata: {
          courseId: validatedData.courseId,
          interval: validatedData.interval,
          courseTitle: course.title,
        },
      },
    });

    return {
      success: true,
      data: {
        subscriptionId: subscription.id,
        stripeSubscriptionId: subscriptionId,
        clientSecret,
        interval: validatedData.interval,
        price,
      },
    };
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);

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
