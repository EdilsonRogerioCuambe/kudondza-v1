/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendEmail } from "@/lib/email-service";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

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
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    console.log(`Received webhook event: ${event.type}`);

    // Processar o evento
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

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
    const { userId, courseId } = subscription.metadata as any;

    if (!userId || !courseId) {
      console.error("Missing metadata in subscription:", subscription.id);
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

    // Enviar email de erro para o admin
    await sendErrorEmail(
      "Erro no processamento de criação de assinatura",
      error,
      {
        subscriptionId: subscription.id,
        userId: subscription.metadata?.userId,
        courseId: subscription.metadata?.courseId,
      }
    );
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

    // Enviar email de erro para o admin
    await sendErrorEmail(
      "Erro no processamento de atualização de assinatura",
      error,
      {
        subscriptionId: subscription.id,
        userId: subscription.metadata?.userId,
        courseId: subscription.metadata?.courseId,
      }
    );
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Marcar assinatura como cancelada
    await prisma.subscription.updateMany({
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

    console.log(`Subscription canceled: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription deleted:", error);

    // Enviar email de erro para o admin
    await sendErrorEmail(
      "Erro no processamento de cancelamento de assinatura",
      error,
      {
        subscriptionId: subscription.id,
      }
    );
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
      include: {
        user: true,
      },
    });

    if (!subscription) {
      console.error("Subscription not found for invoice:", invoice.id);
      return;
    }

    // Buscar dados do curso
    const courseId = (subscription.metadata as any)?.courseId;
    let course = null;
    if (courseId) {
      course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true, slug: true },
      });
    }

    // Criar registro de pagamento
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        amount: invoiceData.amount_paid / 100, // Converter de centavos
        currency: invoice.currency.toUpperCase(),
        status: "SUCCEEDED",
        stripePaymentId: invoiceData.payment_intent as string,
        stripeInvoiceId: invoice.id,
        description: `Pagamento da assinatura - ${
          course?.title || invoice.lines.data[0]?.description || "Curso"
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

    // Enviar email de confirmação de pagamento
    if (subscription.user) {
      await sendEmail({
        to: subscription.user.email,
        subject: "✅ Pagamento Confirmado - Bem-vindo ao seu curso!",
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
                <div style="text-align: center; margin-bottom: 32px;">
                  <div style="display: inline-block; background-color: #10b981; color: white; padding: 16px 24px; border-radius: 50%; font-size: 24px; margin-bottom: 16px;">
                    ✅
                  </div>
                  <h2 style="margin: 0 0 16px 0; color: #3d3929; font-size: 24px; font-weight: bold;">
                    Pagamento Confirmado!
                  </h2>
                  <p style="margin: 0; color: #535146; font-size: 16px;">
                    Olá <strong>${
                      subscription.user.name
                    }</strong>, seu pagamento foi processado com sucesso!
                  </p>
                </div>

                <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #10b981;">
                  <h3 style="margin: 0 0 16px 0; color: #3d3929; font-size: 18px;">Detalhes do Pagamento:</h3>
                  <p style="margin: 8px 0; color: #535146;"><strong>Valor:</strong> ${(
                    invoiceData.amount_paid / 100
                  ).toFixed(2)} ${invoice.currency.toUpperCase()}</p>
                  <p style="margin: 8px 0; color: #535146;"><strong>Data:</strong> ${new Date().toLocaleDateString(
                    "pt-BR"
                  )}</p>
                  <p style="margin: 8px 0; color: #535146;"><strong>Status:</strong> ✅ Confirmado</p>
                  ${
                    course
                      ? `<p style="margin: 8px 0; color: #535146;"><strong>Curso:</strong> ${course.title}</p>`
                      : ""
                  }
                </div>

                <div style="background-color: #ede9de; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="margin: 0 0 12px 0; color: #3d3929; font-size: 18px;">🎉 Bem-vindo ao seu curso!</h3>
                  <p style="margin: 0 0 12px 0; color: #535146;">
                    Agora você tem acesso completo ao conteúdo do curso. Aproveite sua jornada de aprendizado!
                  </p>
                  <ul style="margin: 12px 0; padding-left: 20px; color: #535146;">
                    <li>✅ Acesso a todas as aulas</li>
                    <li>✅ Materiais de apoio</li>
                    <li>✅ Certificado de conclusão</li>
                    <li>✅ Suporte da comunidade</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses${
          course ? `/${course.slug}` : ""
        }"
                     style="background: #c96442; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                    Acessar Curso
                  </a>
                </div>

                <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                  Se precisar de ajuda, não hesite em entrar em contato conosco!
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
      });
    }

    console.log(`Payment succeeded for subscription: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling payment succeeded:", error);

    // Enviar email de erro para o admin
    await sendErrorEmail("Erro no processamento de pagamento", error, {
      invoiceId: invoice.id,
      subscriptionId: (invoice as any)?.subscription,
    });
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
      include: {
        user: true,
      },
    });

    if (!subscription) {
      console.error("Subscription not found for invoice:", invoice.id);
      return;
    }

    // Buscar dados do curso
    const courseId = (subscription.metadata as any)?.courseId;
    let course = null;
    if (courseId) {
      course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true, slug: true },
      });
    }

    // Criar registro de pagamento falhado
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        amount: invoiceData.amount_due / 100,
        currency: invoice.currency.toUpperCase(),
        status: "FAILED",
        stripePaymentId: invoiceData.payment_intent as string,
        stripeInvoiceId: invoice.id,
        description: `Pagamento falhado - ${
          course?.title || invoice.lines.data[0]?.description || "Curso"
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

    // Enviar email de falha no pagamento para o usuário
    if (subscription.user) {
      await sendEmail({
        to: subscription.user.email,
        subject: "⚠️ Problema com Pagamento - Ação Necessária",
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
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 32px 24px; text-align: center;">
                <div style="display: inline-block; margin-bottom: 16px;">
                  <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
                <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Eleve sua experiência de aprendizado</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 24px;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <div style="display: inline-block; background-color: #f59e0b; color: white; padding: 16px 24px; border-radius: 50%; font-size: 24px; margin-bottom: 16px;">
                    ⚠️
                  </div>
                  <h2 style="margin: 0 0 16px 0; color: #3d3929; font-size: 24px; font-weight: bold;">
                    Problema com Pagamento
                  </h2>
                  <p style="margin: 0; color: #535146; font-size: 16px;">
                    Olá <strong>${
                      subscription.user.name
                    }</strong>, houve um problema com o processamento do seu pagamento.
                  </p>
                </div>

                <div style="background-color: #fef2f2; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #ef4444;">
                  <h3 style="margin: 0 0 16px 0; color: #3d3929; font-size: 18px;">Detalhes do Problema:</h3>
                  <p style="margin: 8px 0; color: #535146;"><strong>Valor:</strong> ${(
                    invoiceData.amount_due / 100
                  ).toFixed(2)} ${invoice.currency.toUpperCase()}</p>
                  <p style="margin: 8px 0; color: #535146;"><strong>Data:</strong> ${new Date().toLocaleDateString(
                    "pt-BR"
                  )}</p>
                  <p style="margin: 8px 0; color: #535146;"><strong>Status:</strong> ❌ Falhou</p>
                  ${
                    course
                      ? `<p style="margin: 8px 0; color: #535146;"><strong>Curso:</strong> ${course.title}</p>`
                      : ""
                  }
                  <p style="margin: 8px 0; color: #535146;"><strong>Motivo:</strong> ${
                    invoiceData.last_payment_error?.message ||
                    "Erro no processamento"
                  }</p>
                </div>

                <div style="background-color: #ede9de; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="margin: 0 0 12px 0; color: #3d3929; font-size: 18px;">🔧 Como Resolver:</h3>
                  <ol style="margin: 12px 0; padding-left: 20px; color: #535146;">
                    <li>Acesse sua conta no Kudondza</li>
                    <li>Vá para "Configurações de Pagamento"</li>
                    <li>Atualize seus dados de cartão</li>
                    <li>Ou entre em contato conosco se precisar de ajuda</li>
                  </ol>
                </div>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile"
                     style="background: #c96442; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                    Atualizar Método de Pagamento
                  </a>
                </div>

                <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                  Se precisar de ajuda, não hesite em entrar em contato conosco!
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
      });
    }

    console.log(`Payment failed for subscription: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling payment failed:", error);

    // Enviar email de erro para o admin
    await sendErrorEmail("Erro no processamento de pagamento falhado", error, {
      invoiceId: invoice.id,
      subscriptionId: (invoice as any)?.subscription,
    });
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

    // Enviar email de erro para o admin
    await sendErrorEmail("Erro no processamento de fim de trial", error, {
      subscriptionId: subscription.id,
      userId: subscription.metadata?.userId,
      courseId: subscription.metadata?.courseId,
    });
  }
}

// Função para enviar emails de erro para o admin
async function sendErrorEmail(
  title: string,
  error: any,
  context?: Record<string, any>
) {
  try {
    const adminEmail = env.SMTP_FROM_EMAIL || "admin@kudondza.com";

    await sendEmail({
      to: adminEmail,
      subject: `🚨 Erro no Sistema Kudondza: ${title}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Erro no Sistema - Kudondza</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'DM Mono', 'Courier New', monospace; line-height: 1.6; color: #3d3929;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 32px 24px; text-align: center;">
              <div style="display: inline-block; margin-bottom: 16px;">
                <img src="https://kudondza-v1.vercel.app/Kudondza.png" alt="Kudondza" width="48" height="48" style="display: block; border-radius: 4px;">
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Kudondza</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">Sistema de Monitoramento</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background-color: #ef4444; color: white; padding: 16px 24px; border-radius: 50%; font-size: 24px; margin-bottom: 16px;">
                  🚨
                </div>
                <h2 style="margin: 0 0 16px 0; color: #3d3929; font-size: 24px; font-weight: bold;">
                  ${title}
                </h2>
                <p style="margin: 0; color: #535146; font-size: 16px;">
                  Um erro foi detectado no sistema e requer atenção imediata.
                </p>
              </div>

              <div style="background-color: #fef2f2; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #ef4444;">
                <h3 style="margin: 0 0 16px 0; color: #3d3929; font-size: 18px;">Detalhes do Erro:</h3>
                <p style="margin: 8px 0; color: #535146;"><strong>Data/Hora:</strong> ${new Date().toLocaleString(
                  "pt-BR"
                )}</p>
                <p style="margin: 8px 0; color: #535146;"><strong>Erro:</strong> ${
                  error?.message || "Erro desconhecido"
                }</p>
                <p style="margin: 8px 0; color: #535146;"><strong>Stack:</strong></p>
                <pre style="background-color: #f3f4f6; padding: 12px; border-radius: 4px; font-size: 12px; overflow-x: auto; color: #374151;">${
                  error?.stack || "N/A"
                }</pre>
              </div>

              ${
                context
                  ? `
                <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #3b82f6;">
                  <h3 style="margin: 0 0 16px 0; color: #3d3929; font-size: 18px;">Contexto:</h3>
                  <pre style="background-color: #f3f4f6; padding: 12px; border-radius: 4px; font-size: 12px; overflow-x: auto; color: #374151;">${JSON.stringify(
                    context,
                    null,
                    2
                  )}</pre>
                </div>
              `
                  : ""
              }

              <div style="background-color: #ede9de; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #3d3929; font-size: 18px;">🔧 Ações Recomendadas:</h3>
                <ul style="margin: 12px 0; padding-left: 20px; color: #535146;">
                  <li>Verificar logs do servidor</li>
                  <li>Verificar status dos serviços</li>
                  <li>Verificar configurações do Stripe</li>
                  <li>Verificar conectividade com banco de dados</li>
                </ul>
              </div>

              <p style="margin: 24px 0 0 0; color: #83827d; font-size: 14px; text-align: center;">
                Este é um email automático do sistema de monitoramento.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f4ee; padding: 24px; text-align: center; border-top: 1px solid #dad9d4;">
              <p style="margin: 0 0 8px 0; color: #3d3d3a; font-size: 14px; font-weight: bold;">
                Kudondza - Sistema de Monitoramento
              </p>
              <p style="margin: 0; color: #83827d; font-size: 12px;">
                O futuro da Educação Online em Moçambique
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (emailError) {
    console.error("Erro ao enviar email de erro:", emailError);
  }
}
