import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const inputDir = resolve("public/merch/mockups");
const outputPath = resolve("content/merch/generated/mockup-products.sql");
const imageExtensions = [".png", ".jpg", ".jpeg", ".webp"];
const defaultSizes = ["S", "M", "L", "XL", "XXL"];
const defaultColors = ["Black"];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleize = (value) =>
  String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const sqlValue = (value) => {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
};

const sqlJson = (value) => `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
const sqlTextArray = (items) => `ARRAY[${items.map(sqlValue).join(", ")}]::text[]`;

function findImage(files, side) {
  return files.find((file) => {
    const parsed = file.toLowerCase();
    return parsed.includes(side) && imageExtensions.includes(extname(parsed));
  });
}

function readJson(path) {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    out[trimmed.slice(0, index)] = trimmed.slice(index + 1).replace(/^['"]|['"]$/g, "");
  }
  return out;
}

function getProducts() {
  if (!existsSync(inputDir)) return [];

  return readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const folder = entry.name;
      const folderPath = join(inputDir, folder);
      const files = readdirSync(folderPath);
      const meta = readJson(join(folderPath, "product.json"));
      const id = slugify(meta.id || folder);
      const name = meta.name || titleize(id);
      const firstImage = files.find((file) => imageExtensions.includes(extname(file.toLowerCase())));
      const front = findImage(files, "front") || firstImage;
      const back = findImage(files, "back");
      const images = [
        front ? { color: meta.colors?.[0] || "Black", url: `/merch/mockups/${folder}/${front}`, alt: `${name} front mockup` } : null,
        back ? { color: meta.colors?.[0] || "Black Back", url: `/merch/mockups/${folder}/${back}`, alt: `${name} back mockup` } : null,
      ].filter(Boolean);

      if (!images.length) {
        throw new Error(`${folder} must include front/back image files.`);
      }

      const colors = Array.isArray(meta.colors) && meta.colors.length ? meta.colors : defaultColors;
      const sizes = Array.isArray(meta.sizes) && meta.sizes.length ? meta.sizes : defaultSizes;

      return {
        id,
        folder,
        name,
        category: meta.category || "tops",
        categoryLabel: meta.categoryLabel || meta.category_label || "T-Shirts",
        price: Number(meta.price ?? 35),
        description: meta.description || "Official I Luv Hip Hop t-shirt, made for the culture.",
        story: meta.story || "A This Is Hip Hop Caribbean merch drop built around I Luv Hip Hop energy, Kingston nights, and hip hop culture.",
        colors,
        sizes,
        imageClass: meta.imageClass || meta.image_class || "from-neon-red/30 via-black to-white/10",
        images,
        badge: meta.badge || "New Drop",
        isActive: meta.isActive ?? meta.is_active ?? true,
      };
    });
}

function buildSql(products) {
  const statements = [
    "-- Generated from public/merch/mockups",
    "-- Apply in Supabase SQL Editor, or run npm run merch:mockups:apply.",
    "BEGIN;",
    "",
  ];

  for (const product of products) {
    statements.push(`-- ${product.name}`);
    statements.push(`INSERT INTO merch_products (id, name, category, category_label, price, description, story, colors, sizes, image_class, images, badge, source, is_active, synced_at, updated_at)
VALUES (${sqlValue(product.id)}, ${sqlValue(product.name)}, ${sqlValue(product.category)}, ${sqlValue(product.categoryLabel)}, ${product.price.toFixed(2)}, ${sqlValue(product.description)}, ${sqlValue(product.story)}, ${sqlTextArray(product.colors)}, ${sqlTextArray(product.sizes)}, ${sqlValue(product.imageClass)}, ${sqlJson(product.images)}, ${sqlValue(product.badge)}, 'mockup_drop', ${product.isActive ? "TRUE" : "FALSE"}, NOW(), NOW())
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
  updated_at = NOW();`);
    statements.push("");

    for (const color of product.colors) {
      for (const size of product.sizes) {
        const variantId = `${product.id}-${slugify(color)}-${slugify(size)}`;
        statements.push(`INSERT INTO merch_product_variants (id, product_id, color, size, price, availability_status, is_active, synced_at, updated_at)
VALUES (${sqlValue(variantId)}, ${sqlValue(product.id)}, ${sqlValue(color)}, ${sqlValue(size)}, ${product.price.toFixed(2)}, 'mockup_only', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  color = EXCLUDED.color,
  size = EXCLUDED.size,
  price = EXCLUDED.price,
  availability_status = EXCLUDED.availability_status,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();`);
      }
    }
    statements.push("");
  }

  statements.push("COMMIT;");
  statements.push("");
  return statements.join("\n");
}

async function applyProducts(products) {
  const env = { ...loadEnv(".env.local"), ...process.env };
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  for (const product of products) {
    const { error: productError } = await supabase.from("merch_products").upsert({
      id: product.id,
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel,
      price: product.price,
      description: product.description,
      story: product.story,
      colors: product.colors,
      sizes: product.sizes,
      image_class: product.imageClass,
      images: product.images,
      badge: product.badge,
      source: "mockup_drop",
      is_active: product.isActive,
      synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
    if (productError) throw productError;

    for (const color of product.colors) {
      for (const size of product.sizes) {
        const { error: variantError } = await supabase.from("merch_product_variants").upsert({
          id: `${product.id}-${slugify(color)}-${slugify(size)}`,
          product_id: product.id,
          color,
          size,
          price: product.price,
          availability_status: "mockup_only",
          is_active: true,
          synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
        if (variantError) throw variantError;
      }
    }
  }
}

const products = getProducts();
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, buildSql(products));

if (process.argv.includes("--apply")) {
  await applyProducts(products);
  console.log(`Applied ${products.length} mockup product(s) to Supabase.`);
} else {
  console.log(`Generated ${outputPath} for ${products.length} mockup product(s).`);
}
