-- Remove internal fulfillment/vendor language from public merch copy.

UPDATE merch_products
SET
  badge = CASE WHEN badge = 'Printful Sync' THEN 'Official Merch' ELSE badge END,
  description = regexp_replace(COALESCE(description, ''), ' synced to the official Printful fulfillment store\.?', ' made to order for the official ILHH store.', 'gi'),
  story = regexp_replace(COALESCE(story, ''), ' synced from the official Printful store and made to order for This Is Hip Hop Caribbean\.?', ' is official This Is Hip Hop Caribbean merch, made to order after checkout.', 'gi'),
  updated_at = NOW()
WHERE
  badge = 'Printful Sync'
  OR description ILIKE '%Printful%'
  OR story ILIKE '%Printful%';
