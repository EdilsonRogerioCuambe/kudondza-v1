import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createStripeCustomer, stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const STRIPE_CONFIG = {
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses`,
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { priceId, trialPeriodDays, courseSlug } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar o curso pelo slug para obter o ID
    let courseId = null;
    if (courseSlug) {
      const course = await prisma.course.findUnique({
        where: { slug: courseSlug },
        select: { id: true },
      });
      courseId = course?.id;
    }

    // Verificar se o usuário já tem uma assinatura ativa
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Usuário já possui uma assinatura ativa" },
        { status: 400 }
      );
    }

    // Obter ou criar customer no Stripe
    const customerId = await getOrCreateStripeCustomer(session.user.id, {
      email: session.user.email!,
      name: session.user.name!,
    });

    // Criar checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${
        STRIPE_CONFIG.successUrl
      }?session_id={CHECKOUT_SESSION_ID}${
        courseSlug ? `&course_slug=${courseSlug}` : ""
      }`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      subscription_data: {
        trial_period_days: trialPeriodDays || 7,
        metadata: {
          userId: session.user.id,
          courseId: courseId || "",
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Erro ao criar checkout session:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

async function getOrCreateStripeCustomer(
  userId: string,
  userData: { email: string; name: string }
) {
  // Verificar se já existe um customer no banco
  const existingSubscription = await prisma.subscription.findFirst({
    where: { userId },
    select: { stripeCustomerId: true },
  });

  if (existingSubscription?.stripeCustomerId) {
    return existingSubscription.stripeCustomerId;
  }

  // Criar novo customer no Stripe
  const customer = await createStripeCustomer({
    id: userId,
    email: userData.email,
    name: userData.name,
  });
  return customer.id;
}
