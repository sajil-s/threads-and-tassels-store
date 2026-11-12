

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Flower2 } from "lucide-react";
import { getTrendingProducts } from "../../services/productApi";
import { getCurrentOffer } from "../../services/offerApi";
import { Link } from "react-router-dom";


function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [productData, offerData] = await Promise.all([
          getTrendingProducts(),
          getCurrentOffer(),
        ]);

        if (cancelled) return;

        if (productData.success) {
          setProducts(productData.products);
        }

        if (offerData.success) {
          setOffer(offerData.offer);
        }
      } catch (error) {
        console.error("Failed to load trending products:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Apply extra offer discount to discountPrice
  const calculatePrice = (product) => {
    const basePrice = product.discountPrice;

    if (offer?.isActive) {
      return Math.round(
        basePrice * (1 - offer.percentage / 100)
      );
    }

    return basePrice;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  // Loading animation
  if (loading) {
    return (
      <section className="flex min-h-[200px] items-center justify-center bg-ivory">
        {/* <Flower2
          size={28}
          className="animate-spin text-gold"
        /> */}
      </section>
    );
  }

  // Hide section if no trending products
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-ivory px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-7 flex items-end justify-between gap-4 lg:mb-5">

          <div>
            {/* Decorative label */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-gold" />

              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
                The Edit
              </span>
            </div>

            <h2 className="font-serif text-3xl font-normal tracking-tight text-chocolate sm:text-4xl lg:text-5xl">
              Trending Now
            </h2>

            <p className="mt-2 text-xs leading-5 text-taupe sm:text-sm">
              Beautiful fabrics, thoughtfully selected.
            </p>
          </div>

          {/* Desktop View All */}
          
          <Link
           to="/products"
            className="group hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-chocolate transition-colors duration-300 hover:text-gold sm:inline-flex"
          >
           Explore All

            <ArrowUpRight
              size={17}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
         
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">

          {products.map((product) => {
          const finalPrice = product.discountPrice;;

            return (
              <article
                key={product._id}
                className="group flex min-w-0 flex-col"
              >

                {/* Product Image */}
                
<Link
  to={`/products/${product._id}`}
  className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-sand lg:aspect-[4/3]"
>
  <img
    src={product.images?.[0]}
    alt={product.title}
    loading="lazy"
    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
  />
                  {/* Active offer label */}
                  {offer?.isActive && (
                    <span className="absolute left-2 top-2 bg-offwhite/95 px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-wider text-chocolate sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">
                      Special Offer
                    </span>
                  )}

                  {/* Desktop Hover Overlay */}
                  <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                    <span className="flex w-full items-center justify-center gap-2 bg-offwhite/95 px-4 py-3 text-xs font-medium uppercase tracking-wider text-chocolate backdrop-blur-sm">
                      View Product

                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                      />
                    </span>
                  </div>
                </Link>

                {/* Product Information */}
               <div className="flex flex-1 flex-col pt-3">

                  {/* Material */}
                  <p className="text-[10px] uppercase tracking-[0.15em] text-taupe sm:text-xs">
                    {product.materialType}
                  </p>

                  {/* Title */}
                  <h3 className="mt-1 min-h-[40px] font-serif text-sm font-medium leading-5 text-chocolate sm:text-base sm:leading-6">
                    <Link
                      to={`/products/${product._id}`}
                      className="transition-colors duration-300 hover:text-gold"
                    >
                      {product.title}
                    </Link>
                  </h3>

                  {/* Prices */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">

                    <span className="text-sm font-semibold text-chocolate sm:text-base">
                      {formatPrice(finalPrice)}
                    </span>

                    {product.actualPrice > finalPrice && (
                      <span className="text-xs text-taupe line-through sm:text-sm">
                        {formatPrice(product.actualPrice)}
                      </span>
                    )}
                  </div>

                  {/* Minimal Shop Now Link */}
                 <div className="mt-auto pt-3">
                    <Link
                      to={`/products/${product._id}`}
                      className="inline-flex items-center gap-2 border-b border-gold pb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-chocolate transition-all duration-300 hover:gap-3 hover:text-gold sm:text-xs"
                    >
                      Shop Now

                      <ArrowRight
                        size={15}
                        strokeWidth={1.5}
                      />
                    </Link>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile Explore All */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            to="/trending"
            className="inline-flex items-center gap-2 border-b border-gold pb-2 text-xs font-medium uppercase tracking-wider text-chocolate"
          >
            Explore All Products

            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
            />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default TrendingProducts;
