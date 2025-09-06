import {
  EmailNotificationType,
  PaymentStatus,
  SubscriptionStatus,
} from "@/generated/prisma";
import { sendEmailNotification } from "@/lib/email-service";
import prisma from "./prisma";

interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: any;
  };
  api_version: string;
}

interface StripeCustomer {
  id: string;
  email?: string;
  name?: string;
  metadata?: Record<string, string>;
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  trial_start?: number;
  trial_end?: number;
  cancel_at_period_end?: boolean;
  canceled_at?: number;
  ended_at?: number;
  items: {
    data: Array<{
      price?: {
        id: string;
        product: string;
      };
      quantity?: number;
    }>;
  };
  metadata?: Record<string, string>;
}

interface StripeInvoice {
  id: string;
  customer: string;
  subscription?: string;
  payment_intent?: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  period_end: number;
  lines: {
    data: Array<{
      description?: string;
    }>;
  };
  last_payment_error?: {
    message?: string;
  };
}

export async function handleStripeWebhook(event: StripeWebhookEvent) {
  try {
    // Verificar se o evento já foi processado
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existingEvent?.processed) {
      console.log(`Evento ${event.id} já foi processado`);
      return { processed: true };
    }

    // Salvar evento no banco
    const webhookEvent = await prisma.webhookEvent.upsert({
      where: { stripeEventId: event.id },
      create: {
        stripeEventId: event.id,
        type: event.type,
        data: event.data,
        apiVersion: event.api_version,
        processed: false,
      },
      update: {
        data: event.data,
        apiVersion: event.api_version,
      },
    });

    // Processar evento baseado no tipo
    let result: { processed: boolean; error?: string | null } = {
      processed: false,
      error: null,
    };

    switch (event.type) {
      case "customer.created":
        result = await handleCustomerCreated(event.data.object);
        break;
      case "customer.subscription.created":
        result = await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        result = await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        result = await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        result = await handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        result = await handlePaymentFailed(event.data.object);
        break;
      case "invoice.upcoming":
        result = await handleInvoiceUpcoming(event.data.object);
        break;
      case "customer.subscription.trial_will_end":
        result = await handleTrialWillEnd(event.data.object);
        break;
      default:
        console.log(`Evento não tratado: ${event.type}`);
        result = { processed: true, error: null };
    }

    // Marcar evento como processado
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handleCustomerCreated(customer: StripeCustomer) {
  try {
    console.log(`Customer created: ${customer.id}`);
    // Customer created event doesn't require any specific action
    // The customer will be associated with a user when they create a subscription
    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar customer.created:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handleSubscriptionCreated(subscription: StripeSubscription) {
  try {
    const customerId = subscription.customer;

    // Buscar usuário pelo customer ID
    const user = await prisma.user.findFirst({
      where: {
        subscriptions: {
          some: {
            stripeCustomerId: customerId,
          },
        },
      },
    });

    if (!user) {
      console.error("Usuário não encontrado para customer:", customerId);
      return { processed: false, error: "Usuário não encontrado" };
    }

    // Atualizar ou criar subscription
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      create: {
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price?.id,
        stripeProductId: subscription.items.data[0]?.price?.product,
        status: mapStripeStatusToPrisma(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : null,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        quantity: subscription.items.data[0]?.quantity || 1,
        metadata: subscription.metadata,
      },
      update: {
        status: mapStripeStatusToPrisma(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : null,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        quantity: subscription.items.data[0]?.quantity || 1,
        metadata: subscription.metadata,
      },
    });

    // Enviar email de boas-vindas se for trial
    if (subscription.status === "trialing") {
      await sendEmailNotification({
        type: EmailNotificationType.WELCOME,
        recipient: user.email,
        subject: "Bem-vindo ao Kudondza! Seu período de teste começou",
        content: `Olá ${user.name}! Seu período de teste de 7 dias começou. Aproveite todos os recursos premium!`,
        template: "welcome-trial",
        variables: {
          userName: user.name,
          trialEndDate: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toLocaleDateString(
                "pt-BR"
              )
            : null,
        },
      });
    }

    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar subscription.created:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handleSubscriptionUpdated(subscription: StripeSubscription) {
  try {
    const existingSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!existingSubscription) {
      console.error("Subscription não encontrada:", subscription.id);
      return { processed: false, error: "Subscription não encontrada" };
    }

    // Atualizar subscription
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: mapStripeStatusToPrisma(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        endedAt: subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : null,
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : null,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        quantity: subscription.items.data[0]?.quantity || 1,
        metadata: subscription.metadata,
      },
    });

    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar subscription.updated:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handleSubscriptionDeleted(subscription: StripeSubscription) {
  try {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELED,
        endedAt: new Date(),
      },
    });

    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar subscription.deleted:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handlePaymentSucceeded(invoice: StripeInvoice) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: invoice.customer },
    });

    if (!subscription) {
      console.error("Subscription não encontrada para invoice:", invoice.id);
      return { processed: false, error: "Subscription não encontrada" };
    }

    // Criar registro de pagamento
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripePaymentId: invoice.payment_intent,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: PaymentStatus.SUCCEEDED,
        description: `Pagamento da assinatura - ${
          invoice.lines.data[0]?.description || "Assinatura"
        }`,
        paidAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
        },
      },
    });

    // Enviar email de confirmação de pagamento
    const user = await prisma.user.findUnique({
      where: { id: subscription.userId },
    });

    if (user) {
      await sendEmailNotification({
        type: EmailNotificationType.PAYMENT_SUCCEEDED,
        recipient: user.email,
        subject: "Pagamento confirmado - Kudondza",
        content: `Seu pagamento foi processado com sucesso! Obrigado por continuar conosco.`,
        template: "payment-success",
        variables: {
          userName: user.name,
          amount: (invoice.amount_paid / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
        },
      });
    }

    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar payment.succeeded:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handlePaymentFailed(invoice: StripeInvoice) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: invoice.customer },
    });

    if (!subscription) {
      console.error("Subscription não encontrada para invoice:", invoice.id);
      return { processed: false, error: "Subscription não encontrada" };
    }

    // Criar registro de pagamento falhado
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripePaymentId: invoice.payment_intent,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: PaymentStatus.FAILED,
        description: `Pagamento falhado - ${
          invoice.lines.data[0]?.description || "Assinatura"
        }`,
        failedAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
          failureReason: invoice.last_payment_error?.message,
        },
      },
    });

    // Enviar email de falha no pagamento
    const user = await prisma.user.findUnique({
      where: { id: subscription.userId },
    });

    if (user) {
      await sendEmailNotification({
        type: EmailNotificationType.PAYMENT_FAILED,
        recipient: user.email,
        subject: "Falha no pagamento - Kudondza",
        content: `Houve um problema com o processamento do seu pagamento. Por favor, atualize seus dados de pagamento.`,
        template: "payment-failed",
        variables: {
          userName: user.name,
          amount: (invoice.amount_due / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
        },
      });
    }

    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar payment.failed:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handleInvoiceUpcoming(invoice: StripeInvoice) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: invoice.customer },
    });

    if (!subscription) {
      console.error("Subscription não encontrada para invoice:", invoice.id);
      return { processed: false, error: "Subscription não encontrada" };
    }

    const user = await prisma.user.findUnique({
      where: { id: subscription.userId },
    });

    if (!user) {
      console.error(
        "Usuário não encontrado para subscription:",
        subscription.id
      );
      return { processed: false, error: "Usuário não encontrado" };
    }

    // Calcular dias até o vencimento
    const dueDate = new Date(invoice.period_end * 1000);
    const now = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Enviar email de lembrete
    await sendEmailNotification({
      type: EmailNotificationType.SUBSCRIPTION_RENEWAL_REMINDER,
      recipient: user.email,
      subject: `Renovação da assinatura em ${daysUntilDue} dias - Kudondza`,
      content: `Sua assinatura será renovada em ${daysUntilDue} dias. Valor: ${(
        invoice.amount_due / 100
      ).toFixed(2)} ${invoice.currency.toUpperCase()}`,
      template: "renewal-reminder",
      variables: {
        userName: user.name,
        daysUntilDue,
        amount: (invoice.amount_due / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
        dueDate: dueDate.toLocaleDateString("pt-BR"),
      },
    });

    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar invoice.upcoming:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function handleTrialWillEnd(subscription: StripeSubscription) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        subscriptions: {
          some: {
            stripeSubscriptionId: subscription.id,
          },
        },
      },
    });

    if (!user) {
      console.error(
        "Usuário não encontrado para subscription:",
        subscription.id
      );
      return { processed: false, error: "Usuário não encontrado" };
    }

    // Calcular dias até o fim do trial
    if (!subscription.trial_end) {
      console.error(
        "Trial end date not found for subscription:",
        subscription.id
      );
      return { processed: false, error: "Trial end date not found" };
    }

    const trialEnd = new Date(subscription.trial_end * 1000);
    const now = new Date();
    const daysUntilTrialEnd = Math.ceil(
      (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Enviar email de lembrete do trial
    await sendEmailNotification({
      type: EmailNotificationType.TRIAL_ENDING,
      recipient: user.email,
      subject: `Seu período de teste termina em ${daysUntilTrialEnd} dias - Kudondza`,
      content: `Seu período de teste termina em ${daysUntilTrialEnd} dias. Adicione um método de pagamento para continuar usando o Kudondza.`,
      template: "trial-ending",
      variables: {
        userName: user.name,
        daysUntilTrialEnd,
        trialEndDate: trialEnd.toLocaleDateString("pt-BR"),
      },
    });

    return { processed: true };
  } catch (error) {
    console.error("Erro ao processar trial.will_end:", error);
    return {
      processed: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

function mapStripeStatusToPrisma(stripeStatus: string): SubscriptionStatus {
  switch (stripeStatus) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
      return SubscriptionStatus.CANCELED;
    case "unpaid":
      return SubscriptionStatus.UNPAID;
    case "incomplete":
      return SubscriptionStatus.INCOMPLETE;
    case "incomplete_expired":
      return SubscriptionStatus.INCOMPLETE_EXPIRED;
    case "paused":
      return SubscriptionStatus.PAUSED;
    default:
      return SubscriptionStatus.INACTIVE;
  }
}
