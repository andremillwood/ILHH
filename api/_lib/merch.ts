import type { SupabaseClient } from '@supabase/supabase-js';

export interface CheckoutItem {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
}

interface SyncedMerchVariantRow {
    id: string;
    color: string;
    size: string;
    price: number | string;
    printful_sync_variant_id: number | string | null;
    is_active: boolean;
}

interface SyncedMerchProductRow {
    id: string;
    name: string;
    price: number | string;
    merch_product_variants?: SyncedMerchVariantRow[];
}

const buildVariantId = (productId: string, color: string, size: string) =>
    `${productId}-${color.toLowerCase().replace(/\s+/g, '-')}-${size.toLowerCase()}`;

const ilhhOrganicSweatshirtVariants = new Map([
    ['Black:S', 5299336235],
    ['Black:M', 5299336236],
    ['Black:L', 5299336237],
    ['Black:XL', 5299336238],
    ['Black:XXL', 5299336239],
    ['Red:S', 5299336240],
    ['Red:M', 5299336241],
    ['Red:L', 5299336242],
    ['Red:XL', 5299336248],
    ['Red:XXL', 5299336249],
    ['White:S', 5299336250],
    ['White:M', 5299336251],
    ['White:L', 5299336252],
    ['White:XL', 5299336253],
    ['White:XXL', 5299336254],
]);

const ilhhWomensCropTopVariants = new Map([
    ['Black:XS', 5299787318],
    ['Black:S', 5299787319],
    ['Black:M', 5299787320],
    ['Black:L', 5299787321],
    ['Black:XL', 5299787322],
    ['Hazy Pink:XS', 5299787323],
    ['Hazy Pink:S', 5299787324],
    ['Hazy Pink:M', 5299787325],
    ['Hazy Pink:L', 5299787326],
    ['Hazy Pink:XL', 5299787327],
    ['Bubblegum:XS', 5299787328],
    ['Bubblegum:S', 5299787329],
    ['Bubblegum:M', 5299787330],
    ['Bubblegum:L', 5299787331],
    ['Bubblegum:XL', 5299787332],
    ['White:XS', 5299787333],
    ['White:S', 5299787334],
    ['White:M', 5299787335],
    ['White:L', 5299787336],
    ['White:XL', 5299787337],
]);

const ilhhOrganicBaseballHatVariants = new Map([
    ['Black:One size', 5299788698],
    ['Pacific:One size', 5299788700],
    ['Oyster:One size', 5299788701],
]);

export const allowedMerchProducts = new Map([
    ['ilhh-organic-sweatshirt', {
        name: 'ILHH Unisex Organic Sweatshirt',
        price: 74.5,
        variants: ilhhOrganicSweatshirtVariants,
    }],
    ['ilhh-womens-crop-top', {
        name: "ILHH Women's Crop Top",
        price: 57,
        variants: ilhhWomensCropTopVariants,
    }],
    ['ilhh-organic-baseball-hat', {
        name: 'ILHH Organic Baseball Hat',
        price: 38,
        variants: ilhhOrganicBaseballHatVariants,
    }],
]);

export function normalizeCheckoutItems(items: CheckoutItem[]) {
    return items.map((item) => {
        const product = allowedMerchProducts.get(item.productId);
        if (!product) {
            throw new Error(`Invalid product: ${item.productId}`);
        }

        const expectedVariantId = buildVariantId(item.productId, item.color, item.size);
        if (item.variantId !== expectedVariantId) {
            throw new Error(`Invalid variant selection: ${item.variantId}`);
        }

        const printfulVariantId = product.variants.get(`${item.color}:${item.size}`);
        if (!printfulVariantId) {
            throw new Error(`Unsupported Printful variant: ${item.color} / ${item.size}`);
        }

        const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity || 1)));
        return {
            productId: item.productId,
            variantId: item.variantId,
            printfulVariantId,
            name: product.name,
            price: product.price,
            color: item.color,
            size: item.size,
            quantity,
        };
    });
}

export async function normalizeCheckoutItemsWithCatalog(items: CheckoutItem[], supabase: SupabaseClient) {
    const productIds = Array.from(new Set(items.map((item) => item.productId)));
    const { data: products, error } = await supabase
        .from('merch_products')
        .select('id, name, price, merch_product_variants(id, color, size, price, printful_sync_variant_id, is_active)')
        .in('id', productIds)
        .eq('is_active', true);

    if (error || !products || products.length === 0) {
        return normalizeCheckoutItems(items);
    }

    const catalog = new Map<string, {
        name: string;
        price: number;
        variants: Map<string, { id: string; printfulVariantId: number; price: number }>;
    }>();

    for (const product of products as SyncedMerchProductRow[]) {
        const variants = new Map<string, { id: string; printfulVariantId: number; price: number }>();
        for (const variant of product.merch_product_variants || []) {
            if (!variant.is_active || !variant.printful_sync_variant_id) continue;
            variants.set(`${variant.color}:${variant.size}`, {
                id: variant.id,
                printfulVariantId: Number(variant.printful_sync_variant_id),
                price: Number(variant.price || product.price),
            });
        }
        catalog.set(product.id, {
            name: product.name,
            price: Number(product.price),
            variants,
        });
    }

    return items.map((item) => {
        const product = catalog.get(item.productId) || allowedMerchProducts.get(item.productId);
        if (!product) throw new Error(`Invalid product: ${item.productId}`);

        const expectedVariantId = buildVariantId(item.productId, item.color, item.size);
        if (item.variantId !== expectedVariantId) throw new Error(`Invalid variant selection: ${item.variantId}`);

        const variant = product.variants.get(`${item.color}:${item.size}`);
        if (!variant) throw new Error(`Unsupported Printful variant: ${item.color} / ${item.size}`);

        const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity || 1)));
        const variantPrice = typeof variant === 'number' ? product.price : variant.price;
        const printfulVariantId = typeof variant === 'number' ? variant : variant.printfulVariantId;

        return {
            productId: item.productId,
            variantId: item.variantId,
            printfulVariantId,
            name: product.name,
            price: variantPrice,
            color: item.color,
            size: item.size,
            quantity,
        };
    });
}
