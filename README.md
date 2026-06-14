## I Luv Hip Hop

This app was created using https://getmocha.com.
Need help or want to join the community? Join our [Discord](https://discord.gg/shDEGBSe2d).

To run the devserver:
```
npm install
npm run dev
```

### Event Content Updates

Event flyers and DJ images can be managed as normal files:

- Put event flyer graphics in `public/flyers/`.
- Put DJ or promoter images in `public/djs/`.
- Edit event details in `content/events/events.csv`.
- Run `npm run content:events` to generate `content/events/generated/events-import.sql`.
- Paste the generated SQL into the Supabase SQL Editor to update the live event tables.

See `content/events/README.md` for the CSV column guide and DJ lineup format.

### Ecommerce Integrations

The merch store is prepared for Stripe Checkout and Printful fulfillment.

Required payment env vars:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd
SITE_URL=https://your-domain.com
```

Required fulfillment env vars:
```
PRINTFUL_API_KEY=...
PRINTFUL_STORE_ID=...
CRON_SECRET=...
```

Printful product sync:

- Vercel runs `/api/admin` daily at 09:00 UTC with `Authorization: Bearer $CRON_SECRET`.
- The cron pulls synced Printful products and variants into `merch_products` and `merch_product_variants`.
- The public store reads `/api/public?resource=merch`, and checkout validates against the synced catalog.
- Run `supabase/migrations/20260509_printful_product_sync.sql` before enabling the cron in production.
- To trigger manually, call the endpoint with `Authorization: Bearer $CRON_SECRET`.

Required transactional email env vars:
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=I Love Hip Hop JA <noreply@ilovehiphopja.com>
RESEND_ORDERS_FROM_EMAIL=I Love Hip Hop JA Orders <orders@ilovehiphopja.com>
RESEND_EVENTS_FROM_EMAIL=I Love Hip Hop JA Events <events@ilovehiphopja.com>
RESEND_MEMBERS_FROM_EMAIL=I Love Hip Hop JA Members <members@ilovehiphopja.com>
RESEND_OPS_FROM_EMAIL=I Love Hip Hop JA Ops <ops@ilovehiphopja.com>
RESEND_REPLY_TO=admin@ilovehiphopja.com
ADMIN_NOTIFY_EMAILS=admin@ilovehiphopja.com
```

Affiliate tracking uses `?aff=CODE` or `?ref=CODE`, stores the code in the cart, and passes it to Stripe Checkout metadata as `affiliate_code`.

Stripe webhook endpoint:
```
https://your-domain.com/api/stripe-webhook
```

Subscribe it to `checkout.session.completed`, `checkout.session.expired`, and `payment_intent.payment_failed`.
