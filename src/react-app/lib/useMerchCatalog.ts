import { useEffect, useState } from "react";
import { merchProducts, type MerchProduct } from "@/react-app/lib/merchProducts";

export function useMerchCatalog() {
  const [products, setProducts] = useState<MerchProduct[]>(merchProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/public?resource=merch")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load merch catalog");
        return response.json();
      })
      .then((data: MerchProduct[]) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading };
}
