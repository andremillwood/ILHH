export interface CheckoutItem {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
}

const buildVariantId = (productId: string, color: string, size: string) =>
    `${productId}-${color.toLowerCase().replace(/\s+/g, '-')}-${size.toLowerCase()}`;

const ilhhOrganicSweatshirtVariants = new Map([
    ['Black:S', 5299336235],
    ['Black:M', 5299336236],
    ['Black:L', 5299336237],
    ['Black:XL', 5299336238],
    ['Black:2XL', 5299336239],
    ['Red:S', 5299336240],
    ['Red:M', 5299336241],
    ['Red:L', 5299336242],
    ['Red:XL', 5299336248],
    ['Red:2XL', 5299336249],
    ['White:S', 5299336250],
    ['White:M', 5299336251],
    ['White:L', 5299336252],
    ['White:XL', 5299336253],
    ['White:2XL', 5299336254],
]);

export const allowedMerchProducts = new Map([
    ['ilhh-organic-sweatshirt', {
        name: 'ILHH Unisex Organic Sweatshirt',
        price: 74.5,
        variants: ilhhOrganicSweatshirtVariants,
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
