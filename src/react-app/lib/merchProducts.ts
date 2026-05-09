export type MerchCategory = "all" | "sweatshirts";

export interface MerchVariant {
  id: string;
  size: string;
  color: string;
  printfulVariantId?: number;
  stripePriceId?: string;
}

export interface MerchProductImage {
  color: string;
  url: string;
  alt: string;
}

export interface MerchProduct {
  id: string;
  name: string;
  category: Exclude<MerchCategory, "all">;
  categoryLabel: string;
  price: number;
  description: string;
  story: string;
  colors: string[];
  sizes: string[];
  imageClass: string;
  images: MerchProductImage[];
  variants: MerchVariant[];
  badge?: string;
}

const buildVariants = (productId: string, sizes: string[], colors: string[]): MerchVariant[] =>
  colors.flatMap((color) =>
    sizes.map((size) => ({
      id: `${productId}-${color.toLowerCase().replace(/\s+/g, "-")}-${size.toLowerCase()}`,
      size,
      color,
    })),
  );

const ilhhOrganicSweatshirtPrintfulVariants: Record<string, number> = {
  "Black:S": 5299336235,
  "Black:M": 5299336236,
  "Black:L": 5299336237,
  "Black:XL": 5299336238,
  "Black:2XL": 5299336239,
  "Red:S": 5299336240,
  "Red:M": 5299336241,
  "Red:L": 5299336242,
  "Red:XL": 5299336248,
  "Red:2XL": 5299336249,
  "White:S": 5299336250,
  "White:M": 5299336251,
  "White:L": 5299336252,
  "White:XL": 5299336253,
  "White:2XL": 5299336254,
};

const buildPrintfulVariants = (productId: string, sizes: string[], colors: string[]) =>
  buildVariants(productId, sizes, colors).map((variant) => ({
    ...variant,
    printfulVariantId: ilhhOrganicSweatshirtPrintfulVariants[`${variant.color}:${variant.size}`],
  }));

export const merchProducts: MerchProduct[] = [
  {
    id: "ilhh-organic-sweatshirt",
    name: "ILHH Unisex Organic Sweatshirt",
    category: "sweatshirts",
    categoryLabel: "Sweatshirts",
    price: 74.5,
    description: "Organic sweatshirt synced to the official Printful fulfillment store.",
    story: "The first live ILHH merch piece connected directly to Printful fulfillment, made to order in Black, Red, and White with front and back artwork.",
    colors: ["Black", "White", "Red"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    imageClass: "from-neon-red/40 via-black to-white/10",
    images: [
      {
        color: "Black",
        url: "https://files.cdn.printful.com/files/054/0545e729fcfe05193a95b1a6a35522b4_preview.png",
        alt: "ILHH Unisex Organic Sweatshirt in Black",
      },
      {
        color: "Red",
        url: "https://files.cdn.printful.com/files/c4c/c4c2c634bf9558ee5f35ab146428ce4f_preview.png",
        alt: "ILHH Unisex Organic Sweatshirt in Red",
      },
      {
        color: "White",
        url: "https://files.cdn.printful.com/files/ef6/ef650f6077a51fb3ff2c3cb6968fc08c_preview.png",
        alt: "ILHH Unisex Organic Sweatshirt in White",
      },
    ],
    badge: "Flagship",
    variants: buildPrintfulVariants("ilhh-organic-sweatshirt", ["S", "M", "L", "XL", "2XL"], ["Black", "White", "Red"]),
  },
];

export const getMerchProduct = (productId: string) =>
  merchProducts.find((product) => product.id === productId);

export const merchCategories = [
  {
    id: "sweatshirts",
    label: "Sweatshirts",
    description: "Made-to-order ILHH sweatshirts fulfilled through the official Printful store.",
  },
] satisfies { id: Exclude<MerchCategory, "all">; label: string; description: string }[];

export const getMerchCategory = (categoryId: string) =>
  merchCategories.find((category) => category.id === categoryId);
