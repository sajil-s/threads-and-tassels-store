
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Flower2 } from "lucide-react";
import { getProducts } from "../../services/productApi";

function AllProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const data = await getProducts(1, 8);

        if (!cancelled && data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <section className="flex min-h-[200px] items-center justify-center bg-offwhite">
        {/* <Flower2 size={28} className="animate-spin text-gold" /> */}
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-offwhite px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-7 text-center lg:mb-5">

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
              Explore The Collection
            </p>

            <span className="h-px w-8 bg-gold" />
          </div>

          <h2 className="font-serif text-3xl text-chocolate sm:text-4xl lg:text-5xl">
            Our Products
          </h2>

          <p className="mt-3 text-xs text-taupe sm:text-sm">
            Discover beautiful fabrics for every occasion.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">

          {products.map((product) => (
            <article
              key={product._id}
              className="group flex min-w-0 flex-col"
            >

              {/* Product Image */}
              <a
                href={`/products/${product._id}`}
                className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-sand lg:aspect-[4/3]"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />

                {/* Desktop Hover Overlay */}
                <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                  <span className="flex w-full items-center justify-center gap-2 bg-offwhite/95 px-4 py-3 text-xs font-medium uppercase tracking-wider text-chocolate backdrop-blur-sm">
                    View Product
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </div>
              </a>

              {/* Product Information */}
              <div className="flex flex-1 flex-col pt-4">

                <p className="text-[10px] uppercase tracking-[0.15em] text-taupe sm:text-xs">
                  {product.materialType}
                </p>

                <h3 className="mt-1 min-h-[40px] font-serif text-sm font-medium leading-5 text-chocolate sm:text-base sm:leading-6">
                  <a
                    href={`/products/${product._id}`}
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {product.title}
                  </a>
                </h3>

                {/* Backend-calculated price */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-chocolate sm:text-base">
                    {formatPrice(product.discountPrice)}
                  </span>

                  {product.actualPrice > product.discountPrice && (
                    <span className="text-xs text-taupe line-through sm:text-sm">
                      {formatPrice(product.actualPrice)}
                    </span>
                  )}
                </div>

                {/* Shop Now */}
                <div className="mt-auto pt-5">
                  <a
                    href={`/products/${product._id}`}
                    className="inline-flex items-center gap-2 border-b border-gold pb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-chocolate transition-all duration-300 hover:gap-3 hover:text-gold sm:text-xs"
                  >
                    Shop Now
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </a>
                </div>

              </div>
            </article>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="mt-12 flex justify-center sm:mt-16">
          <a
            href="/products"
            className="group inline-flex items-center gap-3 rounded-full border border-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-chocolate transition-all duration-300 hover:border-chocolate hover:bg-chocolate hover:text-white"
          >
            Explore All Products

            <ArrowUpRight
              size={17}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>

      </div>
    </section>
  );
}

export default AllProductsSection;
