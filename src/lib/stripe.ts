import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

// In dev without a key we export a stub so the app still runs.
export const stripe = key
  ? new Stripe(key, { apiVersion: "2024-09-30.acacia" as any })
  : (null as unknown as Stripe);

export const STRIPE_ENABLED = Boolean(key);
