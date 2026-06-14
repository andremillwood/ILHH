import type { SupabaseClient } from '@supabase/supabase-js';

type PrintfulSyncProduct = {
    id: number;
    name: string;
    thumbnail_url?: string;
};

type PrintfulSyncVariant = {
    id: number;
    variant_id: number;
    name: string;
    retail_price: string;
    size: string;
    color: string;
    availability_status?: string;
    files?: Array<{ type?: string; preview_url?: string; thumbnail_url?: string; url?: string }>;
};

type PrintfulProductDetail = {
    sync_product: PrintfulSyncProduct;
    sync_variants: PrintfulSyncVariant[];
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const buildVariantId = (productId: string, color: string, size: string) =>
    `${productId}-${slugify(color)}-${slugify(size)}`;

const unique = <T>(items: T[]) => Array.from(new Set(items));

const postgrestInList = (items: string[]) =>
    `(${items.map((item) => `"${item.replace(/"/g, '\\"')}"`).join(',')})`;

function inferCategory(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes('hat') || lower.includes('cap')) return { category: 'hats', categoryLabel: 'Hats' };
    if (lower.includes('crop') || lower.includes('top') || lower.includes('shirt') || lower.includes('tee')) return { category: 'tops', categoryLabel: 'Tops' };
    if (lower.includes('sweatshirt') || lower.includes('hoodie')) return { category: 'sweatshirts', categoryLabel: 'Sweatshirts' };
    return { category: 'apparel', categoryLabel: 'Apparel' };
}

function storyFor(name: string) {
    return `${name} is official This Is Hip Hop Caribbean merch, made to order after checkout.`;
}

function imageClassFor(category: string) {
    if (category === 'hats') return 'from-black via-neon-red/20 to-white/10';
    if (category === 'tops') return 'from-neon-red/30 via-black to-pink-200/20';
    return 'from-neon-red/40 via-black to-white/10';
}

function previewUrl(variant: PrintfulSyncVariant) {
    const preview = variant.files?.find((file) => file.type === 'preview') || variant.files?.[0];
    return preview?.preview_url || preview?.thumbnail_url || preview?.url || '';
}

function productImages(product: PrintfulSyncProduct, variants: PrintfulSyncVariant[]) {
    return unique(variants.map((variant) => variant.color)).map((color) => {
        const variant = variants.find((item) => item.color === color);
        return {
            color,
            url: (variant && previewUrl(variant)) || product.thumbnail_url || '',
            alt: `${product.name} in ${color}`,
        };
    }).filter((image) => image.url);
}

async function printfulFetch(path: string) {
    const printfulApiKey = process.env.PRINTFUL_API_KEY;
    if (!printfulApiKey) throw new Error('PRINTFUL_API_KEY is not configured');

    const response = await fetch(`https://api.printful.com${path}`, {
        headers: {
            Authorization: `Bearer ${printfulApiKey}`,
            ...(process.env.PRINTFUL_STORE_ID ? { 'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID } : {}),
        },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Printful request failed: ${response.status}`);
    return data.result;
}

export async function syncPrintfulProducts(supabase: SupabaseClient) {
    const products = await printfulFetch('/store/products') as Array<{ id: number }>;
    const details = await Promise.all(
        products.map((product) => printfulFetch(`/store/products/${product.id}`) as Promise<PrintfulProductDetail>),
    );
    const syncedAt = new Date().toISOString();
    const activeProductIds: string[] = [];
    const activeVariantIds: string[] = [];

    for (const detail of details) {
        const product = detail.sync_product;
        const variants = detail.sync_variants || [];
        if (variants.length === 0) continue;

        const productId = slugify(product.name);
        const { category, categoryLabel } = inferCategory(product.name);
        const prices = variants.map((variant) => Number(variant.retail_price)).filter(Number.isFinite);
        const price = prices.length ? Math.min(...prices) : 0;
        const colors = unique(variants.map((variant) => variant.color).filter(Boolean));
        const sizes = unique(variants.map((variant) => variant.size).filter(Boolean));
        activeProductIds.push(productId);

        const { error: productError } = await supabase.from('merch_products').upsert({
            id: productId,
            printful_sync_product_id: product.id,
            name: product.name.replace(/\borganic\b/g, 'Organic'),
            category,
            category_label: categoryLabel,
            price,
            description: `${categoryLabel.slice(0, -1) || 'Product'} made to order for the official ILHH store.`,
            story: storyFor(product.name),
            colors,
            sizes,
            image_class: imageClassFor(category),
            images: productImages(product, variants),
            badge: 'Official Merch',
            source: 'printful',
            is_active: true,
            raw_product: product,
            synced_at: syncedAt,
            updated_at: syncedAt,
        }, { onConflict: 'id' });
        if (productError) throw productError;

        for (const variant of variants) {
            const variantId = buildVariantId(productId, variant.color, variant.size);
            activeVariantIds.push(variantId);
            const { error: variantError } = await supabase.from('merch_product_variants').upsert({
                id: variantId,
                product_id: productId,
                printful_sync_variant_id: variant.id,
                printful_catalog_variant_id: variant.variant_id,
                color: variant.color,
                size: variant.size,
                price: Number(variant.retail_price) || price,
                availability_status: variant.availability_status || null,
                is_active: true,
                raw_variant: variant,
                synced_at: syncedAt,
                updated_at: syncedAt,
            }, { onConflict: 'id' });
            if (variantError) throw variantError;
        }
    }

    if (activeProductIds.length > 0) {
        await supabase.from('merch_products').update({ is_active: false, updated_at: syncedAt }).eq('source', 'printful').not('id', 'in', postgrestInList(activeProductIds));
    }
    if (activeVariantIds.length > 0) {
        await supabase.from('merch_product_variants').update({ is_active: false, updated_at: syncedAt }).not('id', 'in', postgrestInList(activeVariantIds));
    }

    return {
        syncedAt,
        products: activeProductIds.length,
        variants: activeVariantIds.length,
    };
}
