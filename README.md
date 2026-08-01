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

### Cloudflare R2 Uploads

DJ mixes, cover artwork, and native event gallery photos upload directly from the browser to R2 using short-lived signed URLs.

Required server env vars:
```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=ilhh-media
R2_PUBLIC_BASE_URL=https://media.your-domain.com
```

`R2_PUBLIC_BASE_URL` should be the bucket's public custom domain (recommended) or its `r2.dev` URL. In Cloudflare R2, add a bucket CORS policy allowing `PUT` from the production site and local development origin, with the `Content-Type` header. The API accepts authenticated audio uploads up to 750 MB, artwork up to 15 MB, and admin gallery images up to 30 MB each.

Printful product sync:

- Vercel runs `/api/admin` daily at 09:00 UTC with `Authorization: Bearer $CRON_SECRET`.
- The cron pulls synced Printful products and variants into `merch_products` and `merch_product_variants`.
- The public store reads `/api/public?resource=merch`, and checkout validates against the synced catalog.
- Run `supabase/migrations/20260509_printful_product_sync.sql` before enabling the cron in production.
- To trigger manually, call the endpoint with `Authorization: Bearer $CRON_SECRET`.

Required transactional email env vars:
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=This Is Hip Hop Caribbean <noreply@ilovehiphopja.com>
RESEND_ORDERS_FROM_EMAIL=This Is Hip Hop Caribbean Orders <orders@ilovehiphopja.com>
RESEND_EVENTS_FROM_EMAIL=This Is Hip Hop Caribbean Events <events@ilovehiphopja.com>
RESEND_MEMBERS_FROM_EMAIL=This Is Hip Hop Caribbean Members <members@ilovehiphopja.com>
RESEND_OPS_FROM_EMAIL=This Is Hip Hop Caribbean Ops <ops@ilovehiphopja.com>
EMAIL_LOGO_URL=https://your-public-logo-url.example/logo.png
RESEND_REPLY_TO=admin@ilovehiphopja.com
ADMIN_NOTIFY_EMAILS=admin@ilovehiphopja.com
```

Affiliate tracking uses `?aff=CODE` or `?ref=CODE`, stores the code in the cart, and passes it to Stripe Checkout metadata as `affiliate_code`.

Stripe webhook endpoint:
```
https://your-domain.com/api/stripe-webhook
```

Subscribe it to `checkout.session.completed`, `checkout.session.expired`, and `payment_intent.payment_failed`.
