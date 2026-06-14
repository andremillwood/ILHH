export type MerchCategory = "all" | "sweatshirts" | "tops" | "hats";

export interface MerchVariant {
  id: string;
  size: string;
  color: string;
  printfulVariantId?: number;
  stripePriceId?: string;
  availabilityStatus?: string;
  isActive?: boolean;
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
  "Black:XXL": 5299336239,
  "Red:S": 5299336240,
  "Red:M": 5299336241,
  "Red:L": 5299336242,
  "Red:XL": 5299336248,
  "Red:XXL": 5299336249,
  "White:S": 5299336250,
  "White:M": 5299336251,
  "White:L": 5299336252,
  "White:XL": 5299336253,
  "White:XXL": 5299336254,
};

const ilhhWomensCropTopPrintfulVariants: Record<string, number> = {
  "Black:XS": 5299787318,
  "Black:S": 5299787319,
  "Black:M": 5299787320,
  "Black:L": 5299787321,
  "Black:XL": 5299787322,
  "Hazy Pink:XS": 5299787323,
  "Hazy Pink:S": 5299787324,
  "Hazy Pink:M": 5299787325,
  "Hazy Pink:L": 5299787326,
  "Hazy Pink:XL": 5299787327,
  "Bubblegum:XS": 5299787328,
  "Bubblegum:S": 5299787329,
  "Bubblegum:M": 5299787330,
  "Bubblegum:L": 5299787331,
  "Bubblegum:XL": 5299787332,
  "White:XS": 5299787333,
  "White:S": 5299787334,
  "White:M": 5299787335,
  "White:L": 5299787336,
  "White:XL": 5299787337,
};

const ilhhOrganicBaseballHatPrintfulVariants: Record<string, number> = {
  "Black:One size": 5299788698,
  "Pacific:One size": 5299788700,
  "Oyster:One size": 5299788701,
};

const buildPrintfulVariants = (productId: string, sizes: string[], colors: string[], printfulVariants: Record<string, number>) =>
  buildVariants(productId, sizes, colors).map((variant) => ({
    ...variant,
    printfulVariantId: printfulVariants[`${variant.color}:${variant.size}`],
  }));

export const merchProducts: MerchProduct[] = [
  {
    id: "ilhh-organic-sweatshirt",
    name: "ILHH Unisex Organic Sweatshirt",
    category: "sweatshirts",
    categoryLabel: "Sweatshirts",
    price: 74.5,
    description: "Organic sweatshirt made to order for the official ILHH store.",
    story: "The first live ILHH merch piece, made to order in Black, Red, and White with front and back artwork.",
    colors: ["Black", "White", "Red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
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
    badge: "Weekly Drop",
    variants: buildPrintfulVariants("ilhh-organic-sweatshirt", ["S", "M", "L", "XL", "XXL"], ["Black", "White", "Red"], ilhhOrganicSweatshirtPrintfulVariants),
  },
  {
    id: "ilhh-womens-crop-top",
    name: "ILHH Women's Crop Top",
    category: "tops",
    categoryLabel: "Tops",
    price: 57,
    description: "Women's crop top made to order for the official ILHH store.",
    story: "A fitted ILHH crop top made to order in Black, Hazy Pink, Bubblegum, and White.",
    colors: ["Black", "Hazy Pink", "Bubblegum", "White"],
    sizes: ["XS", "S", "M", "L", "XL"],
    imageClass: "from-neon-red/30 via-black to-pink-200/20",
    images: [
      {
        color: "Black",
        url: "https://files.cdn.printful.com/files/cae/caec12464a3f19be517c65e6e8eedb81_preview.png",
        alt: "ILHH Women's Crop Top in Black",
      },
      {
        color: "Hazy Pink",
        url: "https://files.cdn.printful.com/files/e54/e5426a2f94c6371146eb646b266c1480_preview.png",
        alt: "ILHH Women's Crop Top in Hazy Pink",
      },
      {
        color: "Bubblegum",
        url: "https://files.cdn.printful.com/files/39d/39d1a4dd7575b1e2b6056d2a3f495e2a_preview.png",
        alt: "ILHH Women's Crop Top in Bubblegum",
      },
      {
        color: "White",
        url: "https://files.cdn.printful.com/files/a71/a718bf4c8a0b851e328b6e60d4435393_preview.png",
        alt: "ILHH Women's Crop Top in White",
      },
    ],
    badge: "New",
    variants: buildPrintfulVariants("ilhh-womens-crop-top", ["XS", "S", "M", "L", "XL"], ["Black", "Hazy Pink", "Bubblegum", "White"], ilhhWomensCropTopPrintfulVariants),
  },
  {
    id: "ilhh-organic-baseball-hat",
    name: "ILHH Organic Baseball Hat",
    category: "hats",
    categoryLabel: "Hats",
    price: 38,
    description: "Organic baseball hat made to order for the official ILHH store.",
    story: "A made-to-order ILHH organic baseball hat available in Black, Pacific, and Oyster.",
    colors: ["Black", "Pacific", "Oyster"],
    sizes: ["One size"],
    imageClass: "from-black via-neon-red/20 to-white/10",
    images: [
      {
        color: "Black",
        url: "https://files.cdn.printful.com/files/cf0/cf077991376a7b42c84fafcb2c521196_preview.png",
        alt: "ILHH Organic Baseball Hat in Black",
      },
      {
        color: "Pacific",
        url: "https://files.cdn.printful.com/files/1c3/1c344d210f9cc85d5412a4f5e09903f9_preview.png",
        alt: "ILHH Organic Baseball Hat in Pacific",
      },
      {
        color: "Oyster",
        url: "https://files.cdn.printful.com/files/bbb/bbbc3d9fe84cea946d4b0c4bfaa5f6d5_preview.png",
        alt: "ILHH Organic Baseball Hat in Oyster",
      },
    ],
    badge: "New",
    variants: buildPrintfulVariants("ilhh-organic-baseball-hat", ["One size"], ["Black", "Pacific", "Oyster"], ilhhOrganicBaseballHatPrintfulVariants),
  },
];

export const getMerchProduct = (productId: string) =>
  merchProducts.find((product) => product.id === productId);

export const merchCategories = [
  {
    id: "sweatshirts",
    label: "Sweatshirts",
    description: "Made-to-order ILHH sweatshirts from the official store.",
  },
  {
    id: "tops",
    label: "Tops",
    description: "Made-to-order ILHH tops from the official store.",
  },
  {
    id: "hats",
    label: "Hats",
    description: "Made-to-order ILHH hats from the official store.",
  },
] satisfies { id: Exclude<MerchCategory, "all">; label: string; description: string }[];

export const getMerchCategory = (categoryId: string) =>
  merchCategories.find((category) => category.id === categoryId);
