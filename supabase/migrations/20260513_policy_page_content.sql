INSERT INTO site_policies (slug, title, body, is_published)
VALUES
  ('terms', 'Terms of Service', 'Welcome to I Love Hip Hop JA. These Terms of Service explain the rules for using our website, attending or RSVP''ing for events, submitting community listings, joining membership experiences, purchasing merch, streaming or uploading mixtape content, and contacting our support team.

Our platform exists to connect Jamaica''s hip hop community with events, music, creators, promoters, venues, culture, and commerce. By using the site, you agree to use it with respect for the community, the artists, the venues, and the people whose work appears here.

Accounts, memberships, RSVPs, event submissions, orders, and support requests must use accurate information. We may review, approve, reject, edit, suspend, or remove submissions, profiles, RSVPs, memberships, listings, uploads, comments, orders, or access when needed to protect the platform, prevent abuse, respond to legal obligations, or maintain the quality and safety of the experience.

Event details are provided for discovery and community coordination. Times, venues, lineups, admission policies, age restrictions, capacity, dress codes, and availability may change. Promoters and venues remain responsible for their own event operations, permissions, safety, ticketing, refunds, and compliance with applicable law.

Merch purchases are subject to payment verification, product availability, fulfillment partner requirements, production timing, shipping carrier performance, customs, and our refund and shipping policies. Payment processing is handled by Stripe. Made-to-order items may not be cancellable once production begins.

You may only submit or upload content that you have the right to share, including flyers, artist images, descriptions, audio, mixes, profile information, and event details. You keep ownership of your content, but you grant I Love Hip Hop JA permission to display, promote, format, edit for clarity, distribute, and use it in connection with the platform and our community channels. Do not submit infringing, misleading, hateful, abusive, fraudulent, sexually exploitative, or unlawful content.

The I Love Hip Hop JA name, platform design, logos, editorial copy, collections, and original materials are protected by intellectual property rights. You may not copy, scrape, resell, impersonate, interfere with, or misuse the platform or its systems.

We may update these terms as the platform grows. Continued use after an update means you accept the revised terms. If you need help with an order, RSVP, membership, event listing, or content concern, contact support through the site.', true),
  ('privacy', 'Privacy Policy', 'I Love Hip Hop JA collects information needed to operate a trusted cultural platform for events, memberships, merch, mixtapes, profiles, community submissions, and support. This policy explains what we collect, why we collect it, and how it is used.

We may collect information you provide directly, including your name, email address, phone number, membership details, RSVP details, event submissions, profile information, mixtape upload details, support messages, shipping information, and order-related information. We also collect basic technical and usage information such as pages visited, referral paths, session identifiers, device or browser details, and analytics events that help us understand platform performance.

We use this information to run the site, manage memberships and RSVPs, review event and profile submissions, process merch orders, provide support, send confirmations or operational messages, prevent fraud and abuse, improve the platform, understand community engagement, and comply with legal or payment obligations.

Payment information is processed by Stripe. We do not store full card numbers on our servers. Merch fulfillment information may be shared with Printful or another fulfillment partner when needed to produce, package, and ship your order. Email, hosting, analytics, database, and operational service providers may process limited information for the services they provide to us.

We do not sell personal information. We may share information when necessary to complete a transaction or request, operate the platform, protect users and partners, investigate abuse, comply with law, or enforce our terms.

Some parts of the platform are public by nature. Approved event listings, creator profiles, gallery materials, and community content may be visible to visitors and may be promoted through I Love Hip Hop JA channels.

We keep information for as long as needed for platform operations, support, accounting, security, legal compliance, and community records. You may contact support to request review, correction, or deletion of personal information where applicable, subject to records we must retain for legitimate operational or legal reasons.

We use reasonable safeguards to protect information, but no online system is perfectly secure. Please use accurate contact information, protect your account access, and contact support if you believe your information has been used improperly.

This policy may be updated as our platform, vendors, and community features evolve. The latest version will be available on this page.', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();
