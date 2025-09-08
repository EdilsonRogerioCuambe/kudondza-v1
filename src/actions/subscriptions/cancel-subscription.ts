"use server";

import { auth } from "@/lib/auth";
import { queueEmail } from "@/lib/email-queue";
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
    console.log("[Action] cancelSubscription called with:", data);
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
    console.log("[Action] cancelSubscription validatedData:", validatedData);

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
        metadata: true,
      },
    });
    console.log("[Action] Found subscription:", subscription);

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
      console.log(
        "[Action] Canceling on Stripe:",
        subscription.stripeSubscriptionId
      );
      await cancelStripeSubscription(subscription.stripeSubscriptionId);
    } else {
      console.log("[Action] No stripeSubscriptionId to cancel on Stripe.");
    }

    // Atualizar no banco de dados
    const updatedSubscription = await prisma.subscription.update({
      where: { id: validatedData.subscriptionId },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
      },
    });
    console.log(
      "[Action] Updated subscription locally:",
      updatedSubscription.id
    );

    // Enviar email de cancelamento imediatamente
    await sendCancellationEmail(updatedSubscription.id);

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

async function sendCancellationEmail(subscriptionId: string) {
  try {
    console.log(
      "[Action] Sending cancellation email for subscription:",
      subscriptionId
    );

    // Buscar dados da assinatura
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      select: {
        userId: true,
        metadata: true,
      },
    });

    if (!subscription) {
      console.error(
        "[Action] Subscription not found for email:",
        subscriptionId
      );
      return;
    }

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: subscription.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      console.error(
        "[Action] User not found for cancellation email:",
        subscription.userId
      );
      return;
    }

    // Buscar dados do curso
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courseId = (subscription.metadata as any)?.courseId;
    let course = null;
    if (courseId) {
      course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          title: true,
          slug: true,
          thumbnail: true,
        },
      });
    }

    if (!course) {
      console.error(
        "[Action] Course not found for cancellation email:",
        courseId
      );
      return;
    }

    // Função auxiliar para obter o nome do usuário
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getUserDisplayName = (user: any) => {
      if (user?.name && user.name.trim() !== "") {
        return user.name;
      }
      if (user?.email) {
        return user.email.split("@")[0];
      }
      return "Usuário";
    };

    const displayName = getUserDisplayName(user);
    console.log(
      "[Action] Sending cancellation email to:",
      user.email,
      "Display name:",
      displayName
    );

    await queueEmail({
      to: user.email,
      subject: "😢 Assinatura Cancelada - Kudondza",
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Assinatura Cancelada - Kudondza</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'DM Mono', 'Courier New', monospace; line-height: 1.6; color: #3d3929;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%); padding: 32px 24px; text-align: center;">
              <div style="display: inline-block; margin-bottom: 16px;">
                <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Eleve sua experiência de aprendizado</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 24px;">
              <h2 style="margin: 0 0 24px 0; color: #3d3929; font-size: 24px; font-weight: bold; text-align: center;">
                😢 Assinatura Cancelada
              </h2>

              <p style="margin: 0 0 24px 0; color: #535146; font-size: 16px; text-align: center;">
                Olá <strong>${displayName}</strong>! Sua assinatura foi cancelada com sucesso.
              </p>

              <!-- Subscription Details Card -->
              <div style="background-color: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 18px; font-weight: bold;">
                  📚 Detalhes da Assinatura
                </h3>
                <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #d1d5db;">
                  <span style="color: #6b7280; font-weight: 500;">Curso:</span>
                  <span style="color: #3d3929; font-weight: bold;">${
                    course?.title || "Curso"
                  }</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #d1d5db;">
                  <span style="color: #6b7280; font-weight: 500;">Data do Cancelamento:</span>
                  <span style="color: #3d3929; font-weight: bold;">${new Date().toLocaleDateString(
                    "pt-BR"
                  )}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0;">
                  <span style="color: #6b7280; font-weight: 500;">Status:</span>
                  <span style="color: #6b7280; font-weight: bold;">❌ Cancelada</span>
                </div>
              </div>

              <!-- Access Information -->
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: bold;">
                  ⏰ Acesso ao Conteúdo
                </h3>
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  Você ainda terá acesso ao conteúdo do curso até o final do período atual.
                  Após isso, será necessário renovar sua assinatura para continuar acessando.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${
        course?.slug || "curso"
      }"
                   style="background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  📖 Continuar Estudando
                </a>
              </div>

              <!-- Feedback Section -->
              <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #0369a1; font-size: 16px; font-weight: bold;">
                  💬 Sua Opinião é Importante
                </h3>
                <p style="margin: 0; color: #0369a1; font-size: 14px;">
                  Gostaríamos de saber o que podemos melhorar. Se você tiver algum feedback ou sugestão,
                  não hesite em nos contatar. Estamos sempre trabalhando para oferecer a melhor experiência de aprendizado!
                </p>
              </div>

              <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                Obrigado por ter escolhido o Kudondza para sua jornada de aprendizado.
                Esperamos vê-lo novamente em breve!
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f4ee; padding: 24px; text-align: center; border-top: 1px solid #dad9d4;">
              <p style="margin: 0 0 8px 0; color: #3d3d3a; font-size: 14px; font-weight: bold;">
                Kudondza
              </p>
              <p style="margin: 0; color: #83827d; font-size: 12px;">
                O futuro da Educação Online em Moçambique
              </p>
              <div style="margin-top: 16px;">
                <a href="https://kudondza.com" style="color: #c96442; text-decoration: none; font-size: 12px; margin: 0 8px;">Website</a>
                <span style="color: #dad9d4;">|</span>
                <a href="mailto:suporte@kudondza.com" style="color: #c96442; text-decoration: none; font-size: 12px; margin: 0 8px;">Suporte</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      priority: "high",
      metadata: {
        type: "SUBSCRIPTION_CANCELLED",
        userId: user.id,
        courseId: courseId,
        subscriptionId: subscriptionId,
      },
    });

    console.log("[Action] Cancellation email sent successfully");
  } catch (error) {
    console.error("[Action] Error sending cancellation email:", error);
  }
}
