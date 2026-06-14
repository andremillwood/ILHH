# Ops Runbook

## Stripe Webhook Retry

1. Open Stripe Workbench, then go to **Webhooks** and select the `https://ilovehiphopja.com/api/stripe-webhook` destination.
2. Open **Event deliveries**, filter to failed events, and inspect the latest response body.
3. Fix the underlying issue first: missing env var, Supabase migration not applied, Printful token/store mismatch, invalid shipping address, or email provider failure.
4. Retry the failed delivery from Stripe after the fix is deployed.
5. Confirm the order in Admin:
   - `pending_payment` means checkout started but was not paid.
   - `paid` means Stripe succeeded but Printful submission did not complete.
   - `submitted_to_printful`, `in_fulfillment`, `shipped`, and `delivered` are fulfillment states.
   - `failed` needs manual review.

For local replay, use Stripe CLI with the live or test event ID:

```bash
stripe events resend evt_... --webhook-endpoint we_...
```

## Printful Submission Failures

Check these in order:

1. `PRINTFUL_API_KEY` and `PRINTFUL_STORE_ID` are present in Vercel production.
2. The paid order has a complete Stripe shipping address.
3. Each merch order item has a `printful_variant_id` that maps to an active Printful sync variant.
4. Printful inventory/availability has not changed since the product catalog was synced.
5. The customer email and phone fields meet Printful recipient requirements for the destination country.

After correcting the issue, either replay the Stripe webhook or update the order manually from Admin and submit/retry fulfillment from the operational queue.

## Manual Status Recovery

Use Admin > Orders:

1. Click **Sync** to pull the latest Printful status for orders with a Printful order ID.
2. Click **Tracking** to enter carrier, tracking number, tracking URL, and lifecycle status manually when webhook/polling data is missing.
3. Click **Resend** after status or tracking is corrected to resend the customer status email.

## Required Production Env

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `PRINTFUL_API_KEY`
- `PRINTFUL_STORE_ID`
- `SITE_URL`
