import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export interface CourseSubscriptionData {
  courseId: string;
  title: string;
  description?: string;
  monthlyPrice: number;
  semesterlyPrice: number;
  yearlyPrice: number;
  currency?: string;
}

export interface CreateSubscriptionData {
  userId: string;
  courseId: string;
  interval: "monthly" | "semesterly" | "yearly";
  customerId?: string;
}

/**
 * Cria ou atualiza os preços de assinatura no Stripe para um curso
 */
export async function createOrUpdateCourseSubscriptionPrices(
  courseData: CourseSubscriptionData
): Promise<{
  productId: string;
  monthlyPriceId: string;
  semesterlyPriceId: string;
  yearlyPriceId: string;
}> {
  try {
    // Verificar se o curso já tem um produto no Stripe
    const course = await prisma.course.findUnique({
      where: { id: courseData.courseId },
      select: {
        stripeProductId: true,
        stripePriceId: true,
      },
    });

    let productId = course?.stripeProductId;

    // Criar ou atualizar produto no Stripe
    if (!productId) {
      const product = await stripe.products.create({
        name: courseData.title,
        description: courseData.description || `Curso: ${courseData.title}`,
        metadata: {
          courseId: courseData.courseId,
          type: "course_subscription",
        },
      });
      productId = product.id;
    } else {
      // Atualizar produto existente
      await stripe.products.update(productId, {
        name: courseData.title,
        description: courseData.description || `Curso: ${courseData.title}`,
        metadata: {
          courseId: courseData.courseId,
          type: "course_subscription",
        },
      });
    }

    // Criar preços para cada intervalo
    const monthlyPrice = await stripe.prices.create({
      product: productId,
      currency: courseData.currency?.toLowerCase() || "mzn",
      unit_amount: Math.round(courseData.monthlyPrice * 100),
      recurring: {
        interval: "month",
        interval_count: 1,
      },
      metadata: {
        courseId: courseData.courseId,
        interval: "monthly",
        type: "course_subscription",
      },
    });

    const semesterlyPrice = await stripe.prices.create({
      product: productId,
      currency: courseData.currency?.toLowerCase() || "mzn",
      unit_amount: Math.round(courseData.semesterlyPrice * 100),
      recurring: {
        interval: "month",
        interval_count: 6,
      },
      metadata: {
        courseId: courseData.courseId,
        interval: "semesterly",
        type: "course_subscription",
      },
    });

    const yearlyPrice = await stripe.prices.create({
      product: productId,
      currency: courseData.currency?.toLowerCase() || "mzn",
      unit_amount: Math.round(courseData.yearlyPrice * 100),
      recurring: {
        interval: "year",
        interval_count: 1,
      },
      metadata: {
        courseId: courseData.courseId,
        interval: "yearly",
        type: "course_subscription",
      },
    });

    // Atualizar o curso com os IDs do Stripe
    await prisma.course.update({
      where: { id: courseData.courseId },
      data: {
        stripeProductId: productId,
        stripePriceId: monthlyPrice.id, // Use monthly as default
      },
    });

    return {
      productId,
      monthlyPriceId: monthlyPrice.id,
      semesterlyPriceId: semesterlyPrice.id,
      yearlyPriceId: yearlyPrice.id,
    };
  } catch (error) {
    console.error("Erro ao criar preços de assinatura no Stripe:", error);
    throw new Error("Falha ao configurar preços de assinatura do curso");
  }
}

/**
 * Cria uma assinatura no Stripe
 */
export async function createStripeSubscription(
  subscriptionData: CreateSubscriptionData
): Promise<{ subscriptionId: string; clientSecret: string }> {
  try {
    // Buscar dados do curso
    const course = await prisma.course.findUnique({
      where: { id: subscriptionData.courseId },
      select: {
        stripeProductId: true,
        stripePriceId: true,
        price: true,
        currency: true,
      },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    // Use the existing priceId and price
    const priceId = course.stripePriceId!;

    // Criar ou buscar customer no Stripe
    let customerId = subscriptionData.customerId;
    if (!customerId) {
      const user = await prisma.user.findUnique({
        where: { id: subscriptionData.userId },
        select: { email: true, name: true },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: subscriptionData.userId,
        },
      });
      customerId = customer.id;
    }

    // Criar assinatura no Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: subscriptionData.userId,
        courseId: subscriptionData.courseId,
        interval: subscriptionData.interval,
      },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentIntent = (invoice as any)
      .payment_intent as Stripe.PaymentIntent;
    const clientSecret = paymentIntent.client_secret!;

    return {
      subscriptionId: subscription.id,
      clientSecret: clientSecret,
    };
  } catch (error) {
    console.error("Erro ao criar assinatura no Stripe:", error);
    throw new Error("Falha ao criar assinatura");
  }
}

/**
 * Cancela uma assinatura no Stripe
 */
export async function cancelStripeSubscription(
  stripeSubscriptionId: string
): Promise<void> {
  try {
    await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (error) {
    console.error("Erro ao cancelar assinatura no Stripe:", error);
    throw new Error("Falha ao cancelar assinatura");
  }
}

/**
 * Reativa uma assinatura cancelada no Stripe
 */
export async function reactivateStripeSubscription(
  stripeSubscriptionId: string
): Promise<void> {
  try {
    await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    console.error("Erro ao reativar assinatura no Stripe:", error);
    throw new Error("Falha ao reativar assinatura");
  }
}

/**
 * Busca uma assinatura no Stripe
 */
export async function getStripeSubscription(
  stripeSubscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.retrieve(stripeSubscriptionId);
  } catch (error) {
    console.error("Erro ao buscar assinatura no Stripe:", error);
    throw new Error("Falha ao buscar assinatura");
  }
}

/**
 * Lista as assinaturas de um customer no Stripe
 */
export async function listCustomerSubscriptions(
  customerId: string
): Promise<Stripe.Subscription[]> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
    });
    return subscriptions.data;
  } catch (error) {
    console.error("Erro ao listar assinaturas do customer:", error);
    throw new Error("Falha ao listar assinaturas");
  }
}
