# HAUL

HAUL is a mobile-first social commerce experience: **Amazon with Instagram**. It combines a shoppable social feed, swipe-based discovery, an AI stylist, mixed native/affiliate checkout, and a personalized Style DNA.

This repository is intentionally runnable without external credentials. Demo data and a deterministic stylist response let a non-technical builder review every core flow before connecting production services.

## What works now

- Responsive five-tab app: Home, Swipe, Stylist, Bag, and Profile
- Ember and Blackout themes
- Shoppable feed posts with fire reactions and quick-buy sheets
- Product swipe actions: pass, save/Style DNA, and add to bag
- AI Stylist chat with structured product recommendations
- Mixed-source bag labeling for native checkout vs. affiliate link-out
- Style DNA profile presentation and saved products
- Claude/Anthropic API route with a no-key demo fallback
- Stripe Checkout API boundary for native products
- Complete Supabase/Postgres schema, pgvector, indexes, and RLS policies

## Local setup

1. Install Node.js 20+ and pnpm.
2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Install and run:

   ```bash
   pnpm install
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

No environment variables are required for demo mode.

## Connect production services

### Supabase

Create a Supabase project, enable Auth providers, then run `supabase/migrations/001_initial_schema.sql` followed by `supabase/seed.sql` in the SQL Editor. Add the project URL, anon key, and server-only service key to `.env.local`.

The schema separates native, Shopify-imported, and affiliate products. User-scoped tables use RLS; products, brands, posts, and public profiles are publicly readable.

### Anthropic

Add `ANTHROPIC_API_KEY`. `/api/stylist` will call Claude and require structured JSON containing a concise answer and catalog product IDs. In production, replace the fixed demo catalog IDs with a server-side Supabase search tool that combines filters and Style DNA vector similarity.

### Stripe

Add `STRIPE_SECRET_KEY` and set `NEXT_PUBLIC_APP_URL`. `/api/checkout` accepts Stripe line items for products whose source is `native`. Affiliate and imported partner products must remain link-outs unless the brand has a direct checkout agreement.

## Architecture notes

- `components/haul-app.tsx` contains the interactive prototype so product/design iteration is fast.
- `lib/demo-data.ts` is the credential-free catalog adapter. Replace it with Supabase queries without changing the screen contracts.
- `supabase/migrations` is the source of truth for data ownership and RLS.
- Server API keys only appear in route handlers; never prefix them with `NEXT_PUBLIC_`.
- The SVG logo is code-native and scales cleanly for web or future native wrappers.

## Suggested next milestones

1. Wire Supabase Auth and replace demo state with persisted queries.
2. Add Stripe webhook fulfillment and order state transitions.
3. Add the Style DNA embedding worker after each swipe batch.
4. Implement buyable DM screens over the included DM schema.
5. Add Shopify OAuth/import workers and affiliate feed schedulers.
6. Add Playwright end-to-end tests before production deployment.

## Important business constraint

HAUL does not hold inventory. Brands such as Lululemon, Aritzia, Nike, Adidas, and Zara may require direct commercial partnerships; the schema does not assume a Shopify or affiliate integration exists for every brand.
