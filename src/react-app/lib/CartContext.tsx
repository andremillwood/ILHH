import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getMerchProduct, type MerchProduct } from "@/react-app/lib/merchProducts";

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  affiliateCode: string | null;
  addItem: (product: MerchProduct, color: string, size: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setAffiliateCode: (code: string | null) => void;
}

const CART_STORAGE_KEY = "tihhc-cart";
const AFFILIATE_STORAGE_KEY = "tihhc-affiliate";
const CartContext = createContext<CartContextValue | null>(null);

const sanitizeQuantity = (quantity: number) => Math.max(1, Math.min(10, Math.floor(quantity || 1)));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [affiliateCode, setAffiliateCodeState] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const storedAffiliate = window.localStorage.getItem(AFFILIATE_STORAGE_KEY);

    if (storedCart) {
      try {
        const parsedItems = JSON.parse(storedCart) as CartItem[];
        setItems(parsedItems.filter((item) => getMerchProduct(item.productId)));
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    }

    if (storedAffiliate) {
      setAffiliateCodeState(storedAffiliate);
    }

    const params = new URLSearchParams(window.location.search);
    const affiliateParam = params.get("aff") || params.get("ref");
    if (affiliateParam) {
      const code = affiliateParam.trim().slice(0, 64);
      setAffiliateCodeState(code);
      window.localStorage.setItem(AFFILIATE_STORAGE_KEY, code);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const setAffiliateCode = (code: string | null) => {
    const cleanCode = code?.trim() || null;
    setAffiliateCodeState(cleanCode);
    if (cleanCode) {
      window.localStorage.setItem(AFFILIATE_STORAGE_KEY, cleanCode);
    } else {
      window.localStorage.removeItem(AFFILIATE_STORAGE_KEY);
    }
  };

  const addItem = (product: MerchProduct, color: string, size: string) => {
    const variant = product.variants.find((item) => item.color === color && item.size === size);
    if (!variant) return;

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.variantId === variant.id);
      if (existing) {
        return currentItems.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: sanitizeQuantity(item.quantity + 1) }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          price: product.price,
          color,
          size,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity: sanitizeQuantity(quantity) } : item,
      ),
    );
  };

  const removeItem = (variantId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      affiliateCode,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      setAffiliateCode,
    };
  }, [affiliateCode, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
