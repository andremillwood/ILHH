-- Generated from public/merch/mockups
-- Apply in Supabase SQL Editor, or run npm run merch:mockups:apply.
BEGIN;

-- Ilhh Alt Icon Black Tshirt
INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES ('ilhh-alt-icon-black-tshirt', 'Ilhh Alt Icon Black Tshirt', 'tops', 'T-Shirts', 35.00, 'Official I Luv Hip Hop t-shirt, made for the culture.', 'A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.', ARRAY['Black']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], 'from-neon-red/30 via-black to-white/10', '[{"color":"Black","url":"/merch/mockups/ILHH ALT ICON BLACK TSHIRT/ilhh-altlogo-people-black-front.png","alt":"Ilhh Alt Icon Black Tshirt front mockup"},{"color":"Black Back","url":"/merch/mockups/ILHH ALT ICON BLACK TSHIRT/ilhh-altlogo-people-black-back.png","alt":"Ilhh Alt Icon Black Tshirt back mockup"}]'::jsonb, 'New Drop', 'mockup_drop', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  story = EXCLUDED.story,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  image_class = EXCLUDED.image_class,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-alt-icon-black-tshirt-black-s', 'ilhh-alt-icon-black-tshirt', 'Black', 'S', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-alt-icon-black-tshirt-black-m', 'ilhh-alt-icon-black-tshirt', 'Black', 'M', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-alt-icon-black-tshirt-black-l', 'ilhh-alt-icon-black-tshirt', 'Black', 'L', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-alt-icon-black-tshirt-black-xl', 'ilhh-alt-icon-black-tshirt', 'Black', 'XL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-alt-icon-black-tshirt-black-xxl', 'ilhh-alt-icon-black-tshirt', 'Black', 'XXL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Ilhh Bleach Chin Chain
INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES ('ilhh-bleach-chin-chain', 'Ilhh Bleach Chin Chain', 'tops', 'T-Shirts', 35.00, 'Official I Luv Hip Hop t-shirt, made for the culture.', 'A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.', ARRAY['Black']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], 'from-neon-red/30 via-black to-white/10', '[{"color":"Black","url":"/merch/mockups/ILHH BLEACH CHIN CHAIN/ilhh-goldchain.png","alt":"Ilhh Bleach Chin Chain front mockup"}]'::jsonb, 'New Drop', 'mockup_drop', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  story = EXCLUDED.story,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  image_class = EXCLUDED.image_class,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-bleach-chin-chain-black-s', 'ilhh-bleach-chin-chain', 'Black', 'S', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-bleach-chin-chain-black-m', 'ilhh-bleach-chin-chain', 'Black', 'M', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-bleach-chin-chain-black-l', 'ilhh-bleach-chin-chain', 'Black', 'L', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-bleach-chin-chain-black-xl', 'ilhh-bleach-chin-chain', 'Black', 'XL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-bleach-chin-chain-black-xxl', 'ilhh-bleach-chin-chain', 'Black', 'XXL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Ilhh Drip Female Black Tshirt
INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES ('ilhh-drip-female-black-tshirt', 'Ilhh Drip Female Black Tshirt', 'tops', 'T-Shirts', 35.00, 'Official I Luv Hip Hop t-shirt, made for the culture.', 'A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.', ARRAY['Black']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], 'from-neon-red/30 via-black to-white/10', '[{"color":"Black","url":"/merch/mockups/ILHH DRIP FEMALE BLACK TSHIRT/ilhh-drip-female1-black-front.png","alt":"Ilhh Drip Female Black Tshirt front mockup"},{"color":"Black Back","url":"/merch/mockups/ILHH DRIP FEMALE BLACK TSHIRT/ilhh-drip-female1-black-back.png","alt":"Ilhh Drip Female Black Tshirt back mockup"}]'::jsonb, 'New Drop', 'mockup_drop', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  story = EXCLUDED.story,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  image_class = EXCLUDED.image_class,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-drip-female-black-tshirt-black-s', 'ilhh-drip-female-black-tshirt', 'Black', 'S', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-drip-female-black-tshirt-black-m', 'ilhh-drip-female-black-tshirt', 'Black', 'M', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-drip-female-black-tshirt-black-l', 'ilhh-drip-female-black-tshirt', 'Black', 'L', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-drip-female-black-tshirt-black-xl', 'ilhh-drip-female-black-tshirt', 'Black', 'XL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-drip-female-black-tshirt-black-xxl', 'ilhh-drip-female-black-tshirt', 'Black', 'XXL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Ilhh Hippaso A
INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-a', 'Ilhh Hippaso A', 'tops', 'T-Shirts', 35.00, 'Official I Luv Hip Hop t-shirt, made for the culture.', 'A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.', ARRAY['Black']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], 'from-neon-red/30 via-black to-white/10', '[{"color":"Black","url":"/merch/mockups/ILHH HIPPASO A /ilhh-hippaso1-front.png","alt":"Ilhh Hippaso A front mockup"},{"color":"Black Back","url":"/merch/mockups/ILHH HIPPASO A /ilhh-hippaso1-back.png","alt":"Ilhh Hippaso A back mockup"}]'::jsonb, 'New Drop', 'mockup_drop', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  story = EXCLUDED.story,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  image_class = EXCLUDED.image_class,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-a-black-s', 'ilhh-hippaso-a', 'Black', 'S', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-a-black-m', 'ilhh-hippaso-a', 'Black', 'M', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-a-black-l', 'ilhh-hippaso-a', 'Black', 'L', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-a-black-xl', 'ilhh-hippaso-a', 'Black', 'XL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-a-black-xxl', 'ilhh-hippaso-a', 'Black', 'XXL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Ilhh Hippaso B
INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-b', 'Ilhh Hippaso B', 'tops', 'T-Shirts', 35.00, 'Official I Luv Hip Hop t-shirt, made for the culture.', 'A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.', ARRAY['Black']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], 'from-neon-red/30 via-black to-white/10', '[{"color":"Black","url":"/merch/mockups/ILHH HIPPASO B/ilhh-hippaso2-front.png","alt":"Ilhh Hippaso B front mockup"},{"color":"Black Back","url":"/merch/mockups/ILHH HIPPASO B/ilhh-hippaso2-back.png","alt":"Ilhh Hippaso B back mockup"}]'::jsonb, 'New Drop', 'mockup_drop', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  story = EXCLUDED.story,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  image_class = EXCLUDED.image_class,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-b-black-s', 'ilhh-hippaso-b', 'Black', 'S', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-b-black-m', 'ilhh-hippaso-b', 'Black', 'M', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-b-black-l', 'ilhh-hippaso-b', 'Black', 'L', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-b-black-xl', 'ilhh-hippaso-b', 'Black', 'XL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-b-black-xxl', 'ilhh-hippaso-b', 'Black', 'XXL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Ilhh Hippaso C
INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-c', 'Ilhh Hippaso C', 'tops', 'T-Shirts', 35.00, 'Official I Luv Hip Hop t-shirt, made for the culture.', 'A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.', ARRAY['Black']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], 'from-neon-red/30 via-black to-white/10', '[{"color":"Black","url":"/merch/mockups/ILHH HIPPASO C/ilhh-hippaso3-front.png","alt":"Ilhh Hippaso C front mockup"}]'::jsonb, 'New Drop', 'mockup_drop', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  story = EXCLUDED.story,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  image_class = EXCLUDED.image_class,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-c-black-s', 'ilhh-hippaso-c', 'Black', 'S', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-c-black-m', 'ilhh-hippaso-c', 'Black', 'M', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-c-black-l', 'ilhh-hippaso-c', 'Black', 'L', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-c-black-xl', 'ilhh-hippaso-c', 'Black', 'XL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-hippaso-c-black-xxl', 'ilhh-hippaso-c', 'Black', 'XXL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Ilhh Renaissance White
INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES ('ilhh-renaissance-white', 'Ilhh Renaissance White', 'tops', 'T-Shirts', 35.00, 'Official I Luv Hip Hop t-shirt, made for the culture.', 'A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.', ARRAY['Black']::text[], ARRAY['S', 'M', 'L', 'XL', 'XXL']::text[], 'from-neon-red/30 via-black to-white/10', '[{"color":"Black","url":"/merch/mockups/ILHH RENAISSANCE WHITE/ilhh-renaissance_white_front.png","alt":"Ilhh Renaissance White front mockup"}]'::jsonb, 'New Drop', 'mockup_drop', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  story = EXCLUDED.story,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  image_class = EXCLUDED.image_class,
  images = EXCLUDED.images,
  badge = EXCLUDED.badge,
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-renaissance-white-black-s', 'ilhh-renaissance-white', 'Black', 'S', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-renaissance-white-black-m', 'ilhh-renaissance-white', 'Black', 'M', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-renaissance-white-black-l', 'ilhh-renaissance-white', 'Black', 'L', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-renaissance-white-black-xl', 'ilhh-renaissance-white', 'Black', 'XL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES ('ilhh-renaissance-white-black-xxl', 'ilhh-renaissance-white', 'Black', 'XXL', 35.00, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

COMMIT;
