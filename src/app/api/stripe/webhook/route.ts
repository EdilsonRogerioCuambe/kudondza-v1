/* eslint-disable @typescript-eslint/no-explicit-any */
import { queueEmail } from "@/lib/email-queue";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    console.log("Webhook received at /api/stripe/webhook");

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    console.log("Webhook body length:", body.length);
    console.log("Stripe signature present:", !!signature);

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Webhook signature verified successfully");
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    console.log(`Received webhook event: ${event.type}`, {
      eventId: event.id,
      created: event.created,
      livemode: event.livemode,
    });
    // Debug subscription id or invoice references
    const payloadObj: any = event.data?.object ?? {};
    if (event.type.startsWith("customer.subscription")) {
      console.log(
        "[Webhook] subscription.id:",
        payloadObj.id,
        "customer:",
        payloadObj.customer,
        "status:",
        payloadObj.status
      );
    }
    if (event.type.startsWith("invoice.")) {
      console.log(
        "[Webhook] invoice.id:",
        payloadObj.id,
        "subscription:",
        payloadObj.subscription,
        "customer:",
        payloadObj.customer
      );
    }

    // Processar o evento
    switch (event.type) {
      case "customer.subscription.created":
        console.log("Processing customer.subscription.created");
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        console.log("Processing customer.subscription.updated");
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        console.log("Processing customer.subscription.deleted");
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        console.log("Processing invoice.payment_succeeded");
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        console.log("Processing invoice.payment_failed");
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.trial_will_end":
        console.log("Processing customer.subscription.trial_will_end");
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log(`Webhook processed successfully: ${event.type}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log("Handling subscription created:", {
      subscriptionId: subscription.id,
      status: subscription.status,
      metadata: subscription.metadata,
      customer: subscription.customer,
      items: subscription.items.data.length,
    });

    const { userId, courseId } = subscription.metadata as any;

    if (!userId || !courseId) {
      console.error("Missing metadata in subscription:", subscription.id, {
        userId,
        courseId,
        metadata: subscription.metadata,
      });
      return;
    }

    // Buscar dados do curso
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        price: true,
        currency: true,
      },
    });

    if (!course) {
      console.error("Course not found:", courseId);
      return;
    }

    // Determinar o intervalo
    const priceId = subscription.items.data[0].price.id;
    let interval: "MONTHLY" | "SEMESTERLY" | "YEARLY";

    if (
      priceId.includes("monthly") ||
      subscription.items.data[0].price.recurring?.interval === "month"
    ) {
      interval = "MONTHLY";
    } else if (priceId.includes("semesterly")) {
      interval = "SEMESTERLY";
    } else if (
      priceId.includes("yearly") ||
      subscription.items.data[0].price.recurring?.interval === "year"
    ) {
      interval = "YEARLY";
    } else {
      console.error(
        "Unknown price interval for subscription:",
        subscription.id
      );
      return;
    }

    // Atualizar ou criar assinatura no banco
    await prisma.subscription.upsert({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      update: {
        status: subscription.status.toUpperCase() as any,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: priceId,
        currentPeriodStart: new Date(
          (subscription as any).current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          (subscription as any).current_period_end * 1000
        ),
        metadata: {
          stripeSubscriptionId: subscription.id,
          interval: interval.toLowerCase(),
        },
      },
      create: {
        userId,
        status: subscription.status.toUpperCase() as any,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: priceId,
        currentPeriodStart: new Date(
          (subscription as any).current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          (subscription as any).current_period_end * 1000
        ),
        metadata: {
          stripeSubscriptionId: subscription.id,
          interval: interval.toLowerCase(),
          courseId,
        },
      },
    });

    console.log(`Subscription created/updated: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const { userId, courseId } = subscription.metadata as any;

    if (!userId || !courseId) {
      console.error("Missing metadata in subscription:", subscription.id);
      return;
    }

    // Atualizar status da assinatura
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: subscription.status.toUpperCase() as any,
        currentPeriodEnd: new Date(
          (subscription as any).current_period_end * 1000
        ),
        canceledAt: (subscription as any).canceled_at
          ? new Date((subscription as any).canceled_at * 1000)
          : null,
      },
    });

    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log("[Webhook] handleSubscriptionDeleted payload:", {
      id: subscription.id,
      customer: subscription.customer,
      status: subscription.status,
      current_period_end: (subscription as any).current_period_end,
    });
    // Buscar a assinatura no banco de dados
    const dbSubscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: subscription.id,
      },
    });

    if (!dbSubscription) {
      console.error(
        "Subscription not found for cancellation:",
        subscription.id
      );
      return;
    }

    // Marcar assinatura como cancelada
    const updateRes = await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
        currentPeriodEnd: new Date(
          (subscription as any).current_period_end * 1000
        ),
      },
    });
    console.log(
      "[Webhook] subscription updateMany result count:",
      updateRes.count
    );

    // Buscar dados do usuário e curso para o email
    const user = await prisma.user.findUnique({
      where: { id: dbSubscription.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const courseId = (dbSubscription.metadata as any)?.courseId;
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

    // Enviar email de cancelamento
    if (user && course) {
      console.log("Sending subscription cancellation email to:", user.email);

      // Função auxiliar para obter o nome do usuário
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
      console.log("Display name for cancellation email:", displayName);

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
          subscriptionId: subscription.id,
        },
      });
      console.log("Subscription cancellation email sent successfully");
    } else {
      console.log(
        "Cancellation email not sent - missing user or course data:",
        {
          hasUser: !!user,
          hasCourse: !!course,
          courseId,
        }
      );
    }

    console.log(`Subscription canceled: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const invoiceData = invoice as any;
    if (!invoiceData.subscription) return;

    const subscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: invoiceData.subscription as string,
      },
    });

    if (!subscription) {
      console.error("Subscription not found for invoice:", invoice.id);
      return;
    }

    // Buscar dados do usuário e curso
    const user = await prisma.user.findUnique({
      where: { id: subscription.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    console.log(
      "User found:",
      user ? { id: user.id, name: user.name, email: user.email } : "null"
    );

    // Debug específico para o nome
    if (user) {
      console.log("User name debug:", {
        name: user.name,
        nameType: typeof user.name,
        nameLength: user.name?.length,
        isNull: user.name === null,
        isUndefined: user.name === undefined,
        isEmpty: user.name === "",
      });
    }

    const courseId = (subscription.metadata as any)?.courseId;
    console.log("Course ID from metadata:", courseId);

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
      console.log("Course found:", course);
    }

    // Criar registro de pagamento
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        amount: invoice.amount_paid / 100, // Converter de centavos
        currency: invoice.currency.toUpperCase(),
        status: "SUCCEEDED",
        stripePaymentId: (invoice as any).payment_intent as string,
        stripeInvoiceId: invoice.id,
        description: `Pagamento da assinatura - ${
          invoice.lines.data[0]?.description || "Curso"
        }`,
        subscriptionId: subscription.id,
        paidAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          subscriptionId: invoiceData.subscription,
        },
      },
    });

    // Atualizar status da assinatura se estava em atraso
    if (subscription.status === "PAST_DUE") {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "ACTIVE",
        },
      });
    }

    // Enviar email de compra bem-sucedida
    console.log("Checking if user and course exist for email:", {
      user: !!user,
      course: !!course,
    });
    if (user && course) {
      console.log("Sending purchase confirmation email to:", user.email);

      // Função auxiliar para obter o nome do usuário
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
      console.log("Display name for email:", displayName);

      await queueEmail({
        to: user.email,
        subject: "🎉 Compra realizada com sucesso! - Kudondza",
        html: `
          <!DOCTYPE html>
          <html lang="pt">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pagamento Confirmado - Kudondza</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'DM Mono', 'Courier New', monospace; line-height: 1.6; color: #3d3929;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #c96442 0%, #d97757 100%); padding: 32px 24px; text-align: center;">
                <div style="display: inline-block; margin-bottom: 16px;">
                  <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
                <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Eleve sua experiência de aprendizado</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 24px;">
                <h2 style="margin: 0 0 24px 0; color: #3d3929; font-size: 24px; font-weight: bold; text-align: center;">
                  🎉 Compra Realizada com Sucesso!
                </h2>

                <p style="margin: 0 0 24px 0; color: #535146; font-size: 16px; text-align: center;">
                  Olá <strong>${displayName}</strong>! Sua compra foi processada com sucesso e você agora tem acesso completo ao curso.
                </p>

                <!-- Course Details Card -->
                <div style="background-color: #ede9de; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="margin: 0 0 16px 0; color: #3d3929; font-size: 18px; font-weight: bold;">
                    📚 Detalhes da Compra
                  </h3>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #dad9d4;">
                    <span style="color: #535146; font-weight: 500;">Curso:</span>
                    <span style="color: #3d3929; font-weight: bold;">${
                      course?.title || "Curso"
                    }</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #dad9d4;">
                    <span style="color: #535146; font-weight: 500;">Valor:</span>
                    <span style="color: #3d3929; font-weight: bold;">${(
                      invoice.amount_paid / 100
                    ).toFixed(2)} ${invoice.currency.toUpperCase()}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #dad9d4;">
                    <span style="color: #535146; font-weight: 500;">Data:</span>
                    <span style="color: #3d3929; font-weight: bold;">${new Date().toLocaleDateString(
                      "pt-BR"
                    )}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0;">
                    <span style="color: #535146; font-weight: 500;">Status:</span>
                    <span style="color: #10b981; font-weight: bold;">✅ Confirmado</span>
                  </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${
          course?.slug || "curso"
        }"
                     style="background: linear-gradient(135deg, #c96442 0%, #d97757 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    🚀 Começar Curso Agora
                  </a>
                </div>

                <!-- Next Steps -->
                <div style="background-color: #f5f4ee; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="margin: 0 0 12px 0; color: #3d3929; font-size: 16px; font-weight: bold;">
                    🎯 Próximos Passos
                  </h3>
                  <ul style="margin: 0; padding-left: 20px; color: #535146; font-size: 14px;">
                    <li style="margin: 4px 0;">Acesse seu curso através do botão acima</li>
                    <li style="margin: 4px 0;">Complete as lições no seu próprio ritmo</li>
                    <li style="margin: 4px 0;">Receba seu certificado ao finalizar</li>
                    <li style="margin: 4px 0;">Participe da comunidade de alunos</li>
                  </ul>
                </div>

                <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                  Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato conosco.
                  Estamos aqui para garantir que você tenha a melhor experiência de aprendizado possível!
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
          type: "PURCHASE_CONFIRMATION",
          userId: user.id,
          courseId: courseId,
          invoiceId: invoice.id,
        },
      });
      console.log("Purchase confirmation email queued successfully");
    } else {
      console.log("Email not sent - missing user or course data");
    }

    console.log(`Payment succeeded for subscription: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling payment succeeded:", error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const invoiceData = invoice as any;
    if (!invoiceData.subscription) return;

    const subscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: invoiceData.subscription as string,
      },
    });

    if (!subscription) {
      console.error("Subscription not found for invoice:", invoice.id);
      return;
    }

    // Criar registro de pagamento falhado
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        amount: invoice.amount_due / 100,
        currency: invoice.currency.toUpperCase(),
        status: "FAILED",
        stripePaymentId: (invoice as any).payment_intent as string,
        stripeInvoiceId: invoice.id,
        description: `Pagamento falhado - ${
          invoice.lines.data[0]?.description || "Curso"
        }`,
        subscriptionId: subscription.id,
        metadata: {
          invoiceId: invoice.id,
          subscriptionId: invoiceData.subscription,
          failureReason: invoiceData.last_payment_error?.message,
        },
      },
    });

    // Atualizar status da assinatura para em atraso
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "PAST_DUE",
      },
    });

    // Buscar dados do usuário e curso para o email
    const user = await prisma.user.findUnique({
      where: { id: subscription.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

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

    // Enviar email de falha no pagamento
    if (user && course) {
      console.log("Sending payment failed email to:", user.email);

      // Função auxiliar para obter o nome do usuário
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
      console.log("Display name for failed payment email:", displayName);

      await queueEmail({
        to: user.email,
        subject: "❌ Problema com seu pagamento - Kudondza",
        html: `
          <!DOCTYPE html>
          <html lang="pt">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Problema com Pagamento - Kudondza</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'DM Mono', 'Courier New', monospace; line-height: 1.6; color: #3d3929;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 32px 24px; text-align: center;">
                <div style="display: inline-block; margin-bottom: 16px;">
                  <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
                <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Eleve sua experiência de aprendizado</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 24px;">
                <h2 style="margin: 0 0 24px 0; color: #3d3929; font-size: 24px; font-weight: bold; text-align: center;">
                  ❌ Problema com seu Pagamento
                </h2>

                <p style="margin: 0 0 24px 0; color: #535146; font-size: 16px; text-align: center;">
                  Olá <strong>${displayName}</strong>! Identificamos um problema com o pagamento da sua assinatura.
                </p>

                <!-- Payment Details Card -->
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="margin: 0 0 16px 0; color: #dc2626; font-size: 18px; font-weight: bold;">
                    💳 Detalhes do Problema
                  </h3>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #fecaca;">
                    <span style="color: #7f1d1d; font-weight: 500;">Curso:</span>
                    <span style="color: #3d3929; font-weight: bold;">${
                      course?.title || "Curso"
                    }</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #fecaca;">
                    <span style="color: #7f1d1d; font-weight: 500;">Valor:</span>
                    <span style="color: #3d3929; font-weight: bold;">${(
                      invoice.amount_due / 100
                    ).toFixed(2)} ${invoice.currency.toUpperCase()}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #fecaca;">
                    <span style="color: #7f1d1d; font-weight: 500;">Data:</span>
                    <span style="color: #3d3929; font-weight: bold;">${new Date().toLocaleDateString(
                      "pt-BR"
                    )}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0;">
                    <span style="color: #7f1d1d; font-weight: 500;">Status:</span>
                    <span style="color: #dc2626; font-weight: bold;">❌ Falhou</span>
                  </div>
                </div>

                <!-- Action Required -->
                <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: bold;">
                    ⚠️ Ação Necessária
                  </h3>
                  <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
                    <li style="margin: 4px 0;">Verifique os dados do seu cartão</li>
                    <li style="margin: 4px 0;">Confirme se há saldo suficiente</li>
                    <li style="margin: 4px 0;">Tente novamente o pagamento</li>
                    <li style="margin: 4px 0;">Entre em contato com seu banco se necessário</li>
                  </ul>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${
          course?.slug || "curso"
        }"
                     style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    🔄 Tentar Pagamento Novamente
                  </a>
                </div>

                <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                  Se você precisar de ajuda ou tiver dúvidas sobre este problema, não hesite em entrar em contato conosco.
                  Estamos aqui para ajudar você a resolver esta situação!
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
          type: "PAYMENT_FAILED",
          userId: user.id,
          courseId: courseId,
          invoiceId: invoice.id,
        },
      });
      console.log("Payment failed email sent successfully");
    } else {
      console.log(
        "Payment failed email not sent - missing user or course data"
      );
    }

    console.log(`Payment failed for subscription: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  try {
    const { userId, courseId } = subscription.metadata as any;

    if (!userId || !courseId) {
      console.error("Missing metadata in subscription:", subscription.id);
      return;
    }

    // Aqui você pode enviar uma notificação para o usuário
    // sobre o fim do período de teste
    console.log(`Trial will end for subscription: ${subscription.id}`);

    // Exemplo: criar notificação
    await prisma.notification.create({
      data: {
        userId,
        title: "Período de teste expirando",
        message:
          "Seu período de teste está prestes a expirar. Atualize seu método de pagamento para continuar acessando o curso.",
        type: "WARNING",
        data: {
          subscriptionId: subscription.id,
          courseId,
        },
      },
    });
  } catch (error) {
    console.error("Error handling trial will end:", error);
  }
}
