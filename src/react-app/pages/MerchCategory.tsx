import { Link, useParams } from "react-router";
import { PackageSearch } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import ProductCard from "@/react-app/components/merch/ProductCard";
import CartPanel from "@/react-app/components/merch/CartPanel";
import { getMerchCategory, merchCategories } from "@/react-app/lib/merchProducts";
import { useMerchCatalog } from "@/react-app/lib/useMerchCatalog";

export default function MerchCategory() {
  const { categoryId } = useParams();
  const category = getMerchCategory(categoryId || "");
  const { products: merchProducts } = useMerchCatalog();
  const products = merchProducts.filter((product) => product.category === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <PackageSearch className="w-16 h-16 text-neon-red mx-auto mb-6" />
          <h1 className="font-display text-6xl text-white mb-4">CATEGORY NOT FOUND</h1>
          <Link to="/merch" className="px-6 py-3 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading uppercase tracking-wider">
            Back To Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-neon-red/10 to-black">
        <div className="max-w-7xl mx-auto">
          <Link to="/merch" className="text-neon-red font-heading uppercase tracking-wider hover:text-white transition">
            Store / {category.label}
          </Link>
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mt-6">
            <div>
              <h1 className="font-display text-7xl md:text-9xl neon-text-simple mb-6">
                {category.label}
              </h1>
              <p className="text-xl text-gray-300 font-heading max-w-3xl">
                {category.description}
              </p>
            </div>
            <div className="neon-border bg-black/80 p-5">
              <p className="font-display text-5xl text-neon-red">{products.length}</p>
              <p className="text-white font-heading uppercase tracking-wider">Products</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-10">
            {merchCategories.map((item) => (
              <Link
                key={item.id}
                to={`/merch/category/${item.id}`}
                className={`px-5 py-3 border font-heading uppercase tracking-wider transition ${item.id === category.id
                  ? "bg-neon-red text-black border-neon-red"
                  : "text-white border-neon-red/40 hover:text-neon-red"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="cart" className="py-16 px-4 bg-gradient-to-b from-black to-neon-red/5">
        <div className="max-w-6xl mx-auto">
          <CartPanel />
        </div>
      </section>

      <Footer />
    </div>
  );
}
