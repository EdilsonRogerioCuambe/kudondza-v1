import { env } from "@/lib/env";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export interface CreateStripeCustomerData {
  id: string;
  email: string;
  name: string;
}

export async function createStripeCustomer(data: CreateStripeCustomerData) {
  return await stripe.customers.create({
    email: data.email,
    name: data.name,
    metadata: {
      userId: data.id,
    },
  });
}
