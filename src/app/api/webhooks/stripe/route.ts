/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const { userId, courseId } = subscription.metadata;

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
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const { userId, courseId } = subscription.metadata;

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
        amount: invoiceData.amount_due / 100,
        currency: invoice.currency.toUpperCase(),
        status: "FAILED",
        stripePaymentId: invoiceData.payment_intent as string,
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

    console.log(`Payment failed for subscription: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  try {
    const { userId, courseId } = subscription.metadata;

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
