"use client";

import { loadStripe } from "@stripe/stripe-js";

// Inicializar Stripe no cliente
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface CheckoutSessionData {
  priceId: string;
  trialPeriodDays?: number;
  successUrl?: string;
  cancelUrl?: string;
  courseSlug?: string;
}

// Função para criar checkout session
export const createCheckoutSession = async (data: CheckoutSessionData) => {
  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  const { sessionId } = await response.json();
  return sessionId;
};

// Função para redirecionar para checkout
export const redirectToCheckout = async (data: CheckoutSessionData) => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error("Stripe failed to initialize");
  }

  const sessionId = await createCheckoutSession(data);

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw new Error(error.message);
  }
};

// Função para criar portal de customer
export const createCustomerPortalSession = async (returnUrl?: string) => {
  const response = await fetch("/api/stripe/create-portal-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ returnUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to create portal session");
  }

  const { url } = await response.json();
  return url;
};

// Função para redirecionar para portal do customer
export const redirectToCustomerPortal = async (returnUrl?: string) => {
  const url = await createCustomerPortalSession(returnUrl);
  window.location.href = url;
};
