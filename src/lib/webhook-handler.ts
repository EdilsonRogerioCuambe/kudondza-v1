import {
  EmailNotificationType,
  PaymentStatus,
  SubscriptionStatus,
} from "@/generated/prisma";
import { queueEmail } from "@/lib/email-queue";
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
      await queueEmail({
        to: user.email,
        subject: "Bem-vindo ao Kudondza! Seu período de teste começou",
        html: `
          <h2>Bem-vindo ao Kudondza, ${user.name}!</h2>
          <p>Seu período de teste de 7 dias começou. Aproveite todos os recursos premium!</p>
          <p>Seu período de teste termina em: ${
            subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toLocaleDateString(
                  "pt-BR"
                )
              : "7 dias"
          }</p>
          <p>Durante este período, você terá acesso completo a:</p>
          <ul>
            <li>✅ Todos os cursos premium</li>
            <li>✅ Certificados de conclusão</li>
            <li>✅ Suporte da comunidade</li>
            <li>✅ Atualizações futuras</li>
          </ul>
          <p>Se precisar de ajuda, não hesite em entrar em contato conosco!</p>
        `,
        priority: "high",
        metadata: {
          type: EmailNotificationType.WELCOME,
          userId: user.id,
          subscriptionId: subscription.id,
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
      await queueEmail({
        to: user.email,
        subject: "Pagamento confirmado - Kudondza",
        html: `
          <h2>Pagamento Confirmado!</h2>
          <p>Olá ${user.name},</p>
          <p>Seu pagamento foi processado com sucesso! Obrigado por continuar conosco.</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalhes do Pagamento:</h3>
            <p><strong>Valor:</strong> ${(invoice.amount_paid / 100).toFixed(
              2
            )} ${invoice.currency.toUpperCase()}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString(
              "pt-BR"
            )}</p>
            <p><strong>Status:</strong> ✅ Confirmado</p>
          </div>
          <p>Seu acesso aos cursos premium foi renovado. Aproveite!</p>
        `,
        priority: "high",
        metadata: {
          type: EmailNotificationType.PAYMENT_SUCCEEDED,
          userId: user.id,
          invoiceId: invoice.id,
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
      await queueEmail({
        to: user.email,
        subject: "Falha no pagamento - Kudondza",
        html: `
          <h2>⚠️ Problema com Pagamento</h2>
          <p>Olá ${user.name},</p>
          <p>Houve um problema com o processamento do seu pagamento. Por favor, atualize seus dados de pagamento.</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3>Detalhes:</h3>
            <p><strong>Valor:</strong> ${(invoice.amount_due / 100).toFixed(
              2
            )} ${invoice.currency.toUpperCase()}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString(
              "pt-BR"
            )}</p>
            <p><strong>Status:</strong> ❌ Falhou</p>
          </div>
          <p>Para resolver este problema:</p>
          <ol>
            <li>Acesse sua conta no Kudondza</li>
            <li>Vá para "Configurações de Pagamento"</li>
            <li>Atualize seus dados de cartão</li>
            <li>Ou entre em contato conosco se precisar de ajuda</li>
          </ol>
        `,
        priority: "high",
        metadata: {
          type: EmailNotificationType.PAYMENT_FAILED,
          userId: user.id,
          invoiceId: invoice.id,
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
    await queueEmail({
      to: user.email,
      subject: `Renovação da assinatura em ${daysUntilDue} dias - Kudondza`,
      html: `
        <h2>🔄 Renovação da Assinatura</h2>
        <p>Olá ${user.name},</p>
        <p>Sua assinatura será renovada em <strong>${daysUntilDue} dias</strong>.</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Detalhes da Renovação:</h3>
          <p><strong>Valor:</strong> ${(invoice.amount_due / 100).toFixed(
            2
          )} ${invoice.currency.toUpperCase()}</p>
          <p><strong>Data de Renovação:</strong> ${dueDate.toLocaleDateString(
            "pt-BR"
          )}</p>
          <p><strong>Dias Restantes:</strong> ${daysUntilDue}</p>
        </div>
        <p>Seus dados de pagamento atuais serão usados para a renovação. Se precisar atualizar, faça isso antes da data de renovação.</p>
      `,
      priority: "normal",
      metadata: {
        type: EmailNotificationType.SUBSCRIPTION_RENEWAL_REMINDER,
        userId: user.id,
        daysUntilDue,
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
    await queueEmail({
      to: user.email,
      subject: `Seu período de teste termina em ${daysUntilTrialEnd} dias - Kudondza`,
      html: `
        <h2>⏰ Período de Teste Terminando</h2>
        <p>Olá ${user.name},</p>
        <p>Seu período de teste termina em <strong>${daysUntilTrialEnd} dias</strong>.</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3>⚠️ Ação Necessária:</h3>
          <p>Para continuar usando o Kudondza após o período de teste, você precisa adicionar um método de pagamento.</p>
          <p><strong>Data de Término:</strong> ${trialEnd.toLocaleDateString(
            "pt-BR"
          )}</p>
          <p><strong>Dias Restantes:</strong> ${daysUntilTrialEnd}</p>
        </div>
        <p>Adicione um método de pagamento agora para não perder o acesso aos seus cursos!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${
            process.env.NEXT_PUBLIC_APP_URL
          }/profile" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Adicionar Método de Pagamento
          </a>
        </div>
      `,
      priority: "high",
      metadata: {
        type: EmailNotificationType.TRIAL_ENDING,
        userId: user.id,
        daysUntilTrialEnd,
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
