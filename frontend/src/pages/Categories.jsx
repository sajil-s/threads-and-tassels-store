
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Layers3 } from "lucide-react";

import { getCategories } from "../services/categoryApi";
import Reveal from "../components/common/Reveal";



function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const data = await getCategories();

        if (active) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load categories."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="min-h-[75vh] bg-ivory px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-taupe">
            Threads & Tassels
          </p>

          <h1 className="font-serif text-4xl text-chocolate sm:text-5xl">
            Our Categories
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-gold" />

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-taupe">
            Explore our thoughtfully selected fabric collections
            and find the perfect material for every occasion.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#EAE2D8] bg-offwhite"
              >
                <div className="aspect-[4/5] animate-pulse bg-[#EAE2D8]" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-[#EAE2D8]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#EAE2D8]" />
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
        {!loading && !error && categories.length === 0 && (
          <div className="py-20 text-center">
            <Layers3
              size={34}
              strokeWidth={1.5}
              className="mx-auto text-gold"
            />

            <h2 className="mt-5 font-serif text-2xl text-chocolate">
              No Categories Available
            </h2>

            <p className="mt-3 text-sm text-taupe">
              Our collections will appear here soon.
            </p>
          </div>
        )}

        {/* Categories Grid */}
        
        {!loading && !error && categories.length > 0 && (
        < Reveal>
         <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group overflow-hidden rounded-2xl border border-[#EAE2D8] bg-offwhite shadow-[0_5px_20px_rgba(74,46,31,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_12px_30px_rgba(74,46,31,0.10)]"
              >
                {/* Category Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F1EBE2]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={`${category.name} fabrics`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Layers3
                        size={42}
                        strokeWidth={1}
                        className="text-gold/60"
                      />
                    </div>
                  )}

                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-offwhite/90 text-chocolate shadow-sm transition-all duration-300 group-hover:bg-gold group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Category Details */}
                <div className="p-4 sm:p-5">
                  <h2 className="truncate font-serif text-lg text-chocolate sm:text-xl">
                    {category.name}
                  </h2>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-taupe">
                      {category.productCount}{" "}
                      {category.productCount === 1
                        ? "Product"
                        : "Products"}
                    </p>

                    <span className="text-[11px] font-medium text-chocolate transition-colors group-hover:text-gold sm:text-xs">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default Categories;
