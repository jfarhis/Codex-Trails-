import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ demo: true, message: "Add STRIPE_SECRET_KEY to enable checkout." });
  const { items } = await request.json();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({ mode: "payment", line_items: items, success_url: `${origin}?checkout=success`, cancel_url: `${origin}?checkout=cancelled` });
  return NextResponse.json({ url: session.url });
}
