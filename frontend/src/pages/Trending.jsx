
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, ShoppingBag } from "lucide-react";

import { getTrendingProducts } from "../services/productApi";
import Reveal from "../components/common/Reveal";

function Trending() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTrending() {
      try {
        setLoading(true);
        setError("");

        const data = await getTrendingProducts();

        if (active) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load trending products."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTrending();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="min-h-[75vh] bg-ivory px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-taupe">
              Threads & Tassels
            </p>

            <h1 className="font-serif text-4xl text-chocolate sm:text-5xl">
              Trending Now
            </h1>

            <div className="mx-auto mt-5 h-px w-16 bg-gold" />

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-taupe">
              Explore the materials everyone is loving right now.
              Discover our trending styles and latest favourites.
            </p>
          </div>
        </Reveal>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-7">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#EAE2D8] bg-offwhite"
              >
                <div className="aspect-[3/4] animate-pulse bg-[#EAE2D8]" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#EAE2D8]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#EAE2D8]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-20 text-center">
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-chocolate px-6 py-3 text-sm text-white transition-colors hover:bg-gold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite px-6 py-14 text-center">
            <TrendingUp
              size={34}
              strokeWidth={1.5}
              className="mx-auto text-gold"
            />

            <h2 className="mt-5 font-serif text-2xl text-chocolate">
              No Trending Products Yet
            </h2>

            <p className="mt-3 text-sm text-taupe">
              Explore our full collection while we update our trending picks.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-chocolate px-6 py-3 text-sm text-white hover:bg-gold"
            >
              <ShoppingBag size={17} />
              Explore Products
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <Reveal>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs text-taupe sm:text-sm">
                Showing {products.length} trending{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-7">
              {products.map((product) => {
                const image =
                  product.images?.[0]?.url ||
                  product.images?.[0];

                const discountedPrice = Number(
                  product.effectivePrice ??
                  product.discountPrice
                );

                const actualPrice = Number(product.actualPrice);

                return (
                  <article
                    key={product._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#EAE2D8]/70 bg-offwhite shadow-[0_3px_18px_rgba(74,46,31,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(74,46,31,0.09)]"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="relative block aspect-[3/4] overflow-hidden bg-sand"
                      aria-label={`View ${product.title}`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-xs text-taupe">
                          Image coming soon
                        </div>
                      )}

                      {product.stock === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-offwhite/95 px-2.5 py-1 text-[9px] font-medium text-chocolate sm:left-3 sm:top-3 sm:text-[10px]">
                          Sold Out
                        </span>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <p className="mb-1 truncate text-[10px] uppercase tracking-[0.12em] text-taupe sm:text-xs">
                        {product.materialType || product.category}
                      </p>

                      <Link to={`/products/${product._id}`}>
                        <h2 className="line-clamp-2 min-h-10 text-[13px] font-medium leading-5 text-chocolate sm:text-base sm:leading-6">
                          {product.title}
                        </h2>
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-chocolate sm:text-base">
                          ₹{discountedPrice.toLocaleString("en-IN")}
                        </span>

                        {actualPrice > discountedPrice && (
                          <span className="text-[11px] text-taupe line-through sm:text-xs">
                            ₹{actualPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/products/${product._id}`}
                        className="mt-4 flex min-h-9 w-full items-center justify-center rounded-lg border border-gold/50 bg-[#F7F0E5] px-2 py-2 text-[11px] font-medium text-chocolate transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-white sm:min-h-10 sm:text-sm"
                      >
                        View Details
                        <ArrowUpRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default Trending;
